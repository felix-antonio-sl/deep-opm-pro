import { entidadIdDeExtremo } from "./extremos";
import { fallo, ok } from "./operaciones/helpers";
import type { FamiliaEfectosPreestado, Id, Modelo, Resultado } from "./tipos";

/** Integridad de la extensión declarada, compartida por importación y edición. */
export function validarSemanticaFamiliasPreestado(
  familias: Record<Id, FamiliaEfectosPreestado> | undefined,
  contexto: Pick<Modelo, "opds" | "entidades" | "estados" | "enlaces" | "abanicos">,
): Resultado<true> {
  const miembrosYaAsignados = new Map<Id, Id>();
  for (const familia of Object.values(familias ?? {})) {
    const semantica = validarSemanticaFamilia(familia, contexto, miembrosYaAsignados);
    if (!semantica.ok) return semantica;
  }
  return ok(true);
}

function validarSemanticaFamilia(
  familia: FamiliaEfectosPreestado,
  contexto: Pick<Modelo, "opds" | "entidades" | "estados" | "enlaces" | "abanicos">,
  miembrosYaAsignados: Map<Id, Id>,
): Resultado<true> {
  const prefijo = `Familia de efectos por preestado inválida: ${familia.id}`;
  const opd = contexto.opds[familia.opdId];
  const proceso = contexto.entidades[familia.procesoId];
  const objeto = contexto.entidades[familia.objetoId];
  if (!opd) return fallo(`${prefijo}.opdId`);
  if (proceso?.tipo !== "proceso") return fallo(`${prefijo}.procesoId`);
  if (objeto?.tipo !== "objeto") return fallo(`${prefijo}.objetoId`);
  if (familia.enlaceIds.length < 2 || new Set(familia.enlaceIds).size !== familia.enlaceIds.length) {
    return fallo(`${prefijo}.enlaceIds requiere al menos dos miembros únicos`);
  }
  if (familia.dominioEstadoIds.length < 2 || new Set(familia.dominioEstadoIds).size !== familia.dominioEstadoIds.length) {
    return fallo(`${prefijo}.dominioEstadoIds requiere estados únicos`);
  }
  const dominio = new Set(familia.dominioEstadoIds);
  for (const estadoId of dominio) {
    if (contexto.estados[estadoId]?.entidadId !== familia.objetoId) {
      return fallo(`${prefijo}.dominioEstadoIds contiene un estado ajeno`);
    }
  }

  const entradas = new Set<Id>();
  for (const enlaceId of familia.enlaceIds) {
    const asignadaA = miembrosYaAsignados.get(enlaceId);
    if (asignadaA) return fallo(`${prefijo}.enlaceIds comparte ${enlaceId} con ${asignadaA}`);
    const enlace = contexto.enlaces[enlaceId];
    if (
      enlace?.tipo !== "efecto"
      || !enlace.estadoEntradaId
      || !enlace.estadoSalidaId
      || !enlace.rutaEtiqueta?.trim()
    ) {
      return fallo(`${prefijo}.enlaceIds contiene un miembro que no es TS3 completo con ruta`);
    }
    const extremos = new Set([
      entidadIdDeExtremo(contexto, enlace.origenId),
      entidadIdDeExtremo(contexto, enlace.destinoId),
    ]);
    if (!extremos.has(familia.procesoId) || !extremos.has(familia.objetoId) || extremos.size !== 2) {
      return fallo(`${prefijo}.enlaceIds contiene un efecto de otro par objeto-proceso`);
    }
    if (
      contexto.estados[enlace.estadoEntradaId]?.entidadId !== familia.objetoId
      || contexto.estados[enlace.estadoSalidaId]?.entidadId !== familia.objetoId
    ) {
      return fallo(`${prefijo}.enlaceIds contiene estados ajenos al objeto`);
    }
    if (!dominio.has(enlace.estadoEntradaId)) {
      return fallo(`${prefijo}.dominioEstadoIds no contiene un preestado miembro`);
    }
    if (entradas.has(enlace.estadoEntradaId)) {
      return fallo(`${prefijo}.enlaceIds declara más de un miembro para el mismo preestado`);
    }
    const aparece = Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId);
    if (!aparece) return fallo(`${prefijo}.enlaceIds contiene un miembro ausente del OPD`);
    const enAbanico = Object.values(contexto.abanicos ?? {}).some((abanico) => abanico.enlaceIds.includes(enlaceId));
    if (enAbanico) return fallo(`${prefijo}.enlaceIds no puede pertenecer a AND, XOR u OR`);
    entradas.add(enlace.estadoEntradaId);
    miembrosYaAsignados.set(enlaceId, familia.id);
  }

  const cubreTodo = entradas.size === dominio.size && [...dominio].every((estadoId) => entradas.has(estadoId));
  if (familia.cobertura === "total" && !cubreTodo) {
    return fallo(`${prefijo}.cobertura total no cubre todo el dominio`);
  }
  if (familia.cobertura === "parcial" && cubreTodo) {
    return fallo(`${prefijo}.cobertura parcial debe dejar al menos un preestado fuera`);
  }
  return ok(true);
}
