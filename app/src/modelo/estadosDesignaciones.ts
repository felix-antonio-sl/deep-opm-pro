import { estadosDeEntidad } from "./operaciones";
import type { DesignacionEstado, Estado, Id, Modelo, Resultado } from "./tipos";

export const DESIGNACIONES_ESTADO: readonly DesignacionEstado[] = ["inicial", "final", "default", "current"] as const;

export function designarInicial(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  return agregarDesignacion(modelo, estadoId, "inicial");
}

export function designarFinal(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  return agregarDesignacion(modelo, estadoId, "final");
}

export function designarDefault(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (tieneDesignacion(estado, "current")) return fallo("Default y Current son excluyentes");
  return reemplazarUnicaPorEntidad(modelo, estadoId, "default");
}

export function designarCurrent(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (tieneDesignacion(estado, "default")) return fallo("Default y Current son excluyentes");
  return reemplazarUnicaPorEntidad(modelo, estadoId, "current");
}

export function quitarDesignacion(modelo: Modelo, estadoId: Id, designacion: DesignacionEstado): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (!esDesignacionEstado(designacion)) return fallo(`Designación inválida: ${designacion}`);
  return ok({
    ...modelo,
    estados: {
      ...modelo.estados,
      [estadoId]: aplicarDesignaciones(estado, designacionesEstado(estado).filter((item) => item !== designacion)),
    },
  });
}

export function suprimirEstado(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (estadoTieneEnlaces(modelo, estadoId)) return fallo("El estado no puede suprimirse porque tiene enlaces incidentes");
  if (estado.suprimido) return ok(modelo);
  return actualizarEstado(modelo, estadoId, { ...estado, suprimido: true });
}

export function restaurarEstado(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  if (!estado.suprimido) return ok(modelo);
  const actualizado = { ...estado };
  delete actualizado.suprimido;
  return actualizarEstado(modelo, estadoId, actualizado);
}

export function designacionesEstado(estado: Estado): DesignacionEstado[] {
  const valores = [
    ...(estado.designaciones ?? []).filter(esDesignacionEstado),
    ...(estado.esInicial ? ["inicial" as const] : []),
    ...(estado.esFinal ? ["final" as const] : []),
  ];
  return [...new Set(valores)];
}

export function tieneDesignacion(estado: Estado, designacion: DesignacionEstado): boolean {
  return designacionesEstado(estado).includes(designacion);
}

export function estadoTieneEnlaces(modelo: Modelo, estadoId: Id): boolean {
  return Object.values(modelo.enlaces).some((enlace) =>
    (enlace.origenId.kind === "estado" && enlace.origenId.id === estadoId) ||
    (enlace.destinoId.kind === "estado" && enlace.destinoId.id === estadoId)
  );
}

export function esDesignacionEstado(value: unknown): value is DesignacionEstado {
  return typeof value === "string" && (DESIGNACIONES_ESTADO as readonly string[]).includes(value);
}

function agregarDesignacion(modelo: Modelo, estadoId: Id, designacion: DesignacionEstado): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  return actualizarEstado(modelo, estadoId, aplicarDesignaciones(estado, [...designacionesEstado(estado), designacion]));
}

function reemplazarUnicaPorEntidad(modelo: Modelo, estadoId: Id, designacion: "default" | "current"): Resultado<Modelo> {
  const estado = modelo.estados[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const estados = { ...modelo.estados };
  for (const actual of estadosDeEntidad(modelo, estado.entidadId)) {
    const restantes = designacionesEstado(actual).filter((item) => item !== designacion);
    estados[actual.id] = aplicarDesignaciones(actual, actual.id === estadoId ? [...restantes, designacion] : restantes);
  }
  return ok({ ...modelo, estados });
}

function aplicarDesignaciones(estado: Estado, designaciones: DesignacionEstado[]): Estado {
  const unicas = [...new Set(designaciones.filter(esDesignacionEstado))];
  const actualizado: Estado = {
    ...estado,
    ...(unicas.length > 0 ? { designaciones: unicas } : {}),
    ...(unicas.includes("inicial") ? { esInicial: true } : {}),
    ...(unicas.includes("final") ? { esFinal: true } : {}),
  };
  if (!unicas.includes("inicial")) delete actualizado.esInicial;
  if (!unicas.includes("final")) delete actualizado.esFinal;
  if (unicas.length === 0) delete actualizado.designaciones;
  return actualizado;
}

function actualizarEstado(modelo: Modelo, estadoId: Id, estado: Estado): Resultado<Modelo> {
  return ok({
    ...modelo,
    estados: {
      ...modelo.estados,
      [estadoId]: estado,
    },
  });
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
