import type {
  Entidad,
  EstadoCargaSubmodelo,
  Id,
  ModoDespliegueObjeto,
  Opd,
  OpdVista,
  RefinamientoEntidad,
  Resultado,
  SlotRefinamiento,
  TipoRefinamiento,
} from "../modelo/tipos";
import { fallo, ok, esModoDespliegue, esNumeroFinito, esRecord } from "./validarHelpers";
import { validarApariencias, validarAparienciasEnlace } from "./validarApariencias";

/**
 * Validadores para OPDs, refinamiento y modo de despliegue.
 *
 * Consumidores conocidos: `serializacion/json.ts` y `validarEntidades.ts`.
 * Anclaje: SSOT OPM ISO 19450 §Gestion de contexto y refinamiento y
 * §Arboles OPD; OPCloud separa OPDs al serializar en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:77`.
 *
 * Ronda 15.2: schema dual. La nueva forma persistida es
 * `refinamientos: Partial<Record<TipoRefinamiento, SlotRefinamiento>>`. La
 * forma legacy `refinamiento: RefinamientoEntidad` se acepta al hidratar y se
 * promueve al record nuevo (funtor faithful: ningún modelo válido pre-15.2
 * cambia su semántica).
 */

export function validarRefinamiento(entidadId: Id, value: unknown): Resultado<RefinamientoEntidad | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Refinamiento inválido: ${entidadId}`);
  if (value.tipo !== "descomposicion" && value.tipo !== "despliegue") return fallo(`Refinamiento inválido: ${entidadId}.tipo`);
  if (typeof value.opdId !== "string") return fallo(`Refinamiento inválido: ${entidadId}.opdId`);
  if (value.tipo === "descomposicion") {
    if (value.modo !== undefined) return fallo(`Refinamiento inválido: ${entidadId}.modo`);
    return ok({ tipo: value.tipo, opdId: value.opdId });
  }
  const modo = validarModoDespliegue(entidadId, value.modo);
  if (!modo.ok) return modo;
  return ok({ tipo: value.tipo, opdId: value.opdId, modo: modo.value });
}

export function validarRefinamientos(
  entidadId: Id,
  raw: Record<string, unknown>,
): Resultado<Partial<Record<TipoRefinamiento, SlotRefinamiento>> | undefined> {
  const acumulado: Partial<Record<TipoRefinamiento, SlotRefinamiento>> = {};

  // Fuente 1: campo nuevo `refinamientos`.
  if (raw.refinamientos !== undefined) {
    if (!esRecord(raw.refinamientos)) return fallo(`Refinamientos inválidos: ${entidadId}`);
    for (const [tipo, slot] of Object.entries(raw.refinamientos)) {
      if (tipo !== "descomposicion" && tipo !== "despliegue") {
        return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}`);
      }
      if (slot === undefined) continue;
      if (!esRecord(slot)) return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}`);
      if (typeof slot.opdId !== "string") return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}.opdId`);
      if (tipo === "descomposicion") {
        if (slot.modo !== undefined) return fallo(`Refinamientos inválidos: ${entidadId}.${tipo}.modo`);
        acumulado.descomposicion = { opdId: slot.opdId };
      } else {
        const modo = validarModoDespliegue(entidadId, slot.modo);
        if (!modo.ok) return modo;
        acumulado.despliegue = { opdId: slot.opdId, modo: modo.value };
      }
    }
  }

  // Fuente 2: campo legacy `refinamiento`. Promueve al record si la clave aún no fue ocupada.
  const legacy = validarRefinamiento(entidadId, raw.refinamiento);
  if (!legacy.ok) return legacy;
  if (legacy.value) {
    const tipo = legacy.value.tipo;
    if (acumulado[tipo] === undefined) {
      acumulado[tipo] = tipo === "descomposicion"
        ? { opdId: legacy.value.opdId }
        : { opdId: legacy.value.opdId, modo: legacy.value.modo ?? "agregacion" };
    }
  }

  if (Object.keys(acumulado).length === 0) return ok(undefined);
  return ok(acumulado);
}

export function validarModoDespliegue(entidadId: Id, value: unknown): Resultado<ModoDespliegueObjeto> {
  if (value === undefined) return ok("agregacion");
  if (esModoDespliegue(value)) return ok(value);
  return fallo(`Refinamiento inválido: ${entidadId}.modo`);
}

export function validarOpds(
  value: Record<string, unknown>,
  entidades: Record<Id, Entidad>,
  opdRaizId?: Id,
): Resultado<Record<Id, Opd>> {
  const opds: Record<Id, Opd> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`OPD inválido: ${id}`);
    if (raw.id !== id) return fallo(`OPD inválido: ${id}.id`);
    if (typeof raw.nombre !== "string") return fallo(`OPD inválido: ${id}.nombre`);
    if (raw.padreId !== undefined && raw.padreId !== null && typeof raw.padreId !== "string") {
      return fallo(`OPD inválido: ${id}.padreId`);
    }
    let preguntaGuia: string | undefined;
    if (raw.preguntaGuia !== undefined) {
      if (typeof raw.preguntaGuia !== "string" || !raw.preguntaGuia.trim()) {
        return fallo(`OPD inválido: ${id}.preguntaGuia`);
      }
      preguntaGuia = raw.preguntaGuia.trim();
    }
    if (!esRecord(raw.apariencias)) return fallo(`OPD inválido: ${id}.apariencias`);
    if (!esRecord(raw.enlaces)) return fallo(`OPD inválido: ${id}.enlaces`);
    const vista = validarVistaOpd(id, raw.vista);
    if (!vista.ok) return vista;

    const apariencias = validarApariencias(id, raw.apariencias, entidades);
    if (!apariencias.ok) return apariencias;
    const enlaces = validarAparienciasEnlace(id, raw.enlaces);
    if (!enlaces.ok) return enlaces;
    let ordenLocal: number | undefined;
    if (raw.ordenLocal !== undefined) {
      if (!esNumeroFinito(raw.ordenLocal) || raw.ordenLocal < 0) {
        return fallo(`OPD inválido: ${id}.ordenLocal`);
      }
      ordenLocal = raw.ordenLocal;
    }
    let ordenInzoom: Id[][] | undefined;
    if (raw.ordenInzoom !== undefined) {
      const validado = validarOrdenInzoom(id, raw.ordenInzoom);
      if (!validado.ok) return validado;
      ordenInzoom = validado.value;
    }
    opds[id] = {
      id,
      nombre: raw.nombre,
      // Ausencia legacy se cuelga de la raíz cuando el documento completo la
      // aporta; `null` explícito se conserva porque identifica un OPD de Taller.
      padreId: raw.padreId === undefined && id !== opdRaizId ? opdRaizId ?? null : raw.padreId ?? null,
      ...(preguntaGuia ? { preguntaGuia } : {}),
      apariencias: apariencias.value,
      enlaces: enlaces.value,
      ...(vista.value ? { vista: vista.value } : {}),
      ...(ordenLocal !== undefined ? { ordenLocal } : {}),
      ...(ordenInzoom !== undefined ? { ordenInzoom } : {}),
    };
  }
  return ok(opds);
}

/**
 * Valida la presentacion del orden temporal de subprocesos (ordenInzoom):
 * secuencia de bandas, cada banda un arreglo de ids de subprocesos en paralelo.
 * Verifica la FORMA del preorden (arreglo de arreglos de strings) y la anticadena
 * global (ningun id en dos bandas: violaria la funcion rango r: P→ℕ). Aqui NO se
 * resuelven referencias: este validador no conoce el modelo completo (entidades +
 * refinamiento + apariencias). La integridad referencial dura (que el OPD sea un
 * in-zoom real y que cada id sea un subproceso INTERNO de su descomposicion) la
 * impone `validarOrdenInzoomReferencial` dentro de `validarReferenciasOpd`
 * (validarIntegridad.ts), que corre al final de la hidratacion en json.ts; el
 * checker de diagnostico `checkOrdenInzoomReferenciaInvalida` (checkers.ts) cubre
 * el mismo invariante como aviso blando en runtime.
 */
function validarOrdenInzoom(opdId: Id, value: unknown): Resultado<Id[][]> {
  if (!Array.isArray(value)) return fallo(`OPD inválido: ${opdId}.ordenInzoom`);
  const vistos = new Set<string>();
  const bandas: Id[][] = [];
  for (const banda of value) {
    if (!Array.isArray(banda)) return fallo(`OPD inválido: ${opdId}.ordenInzoom (banda no es arreglo)`);
    const fila: Id[] = [];
    for (const sub of banda) {
      if (typeof sub !== "string") return fallo(`OPD inválido: ${opdId}.ordenInzoom (id no es string)`);
      if (vistos.has(sub)) return fallo(`OPD inválido: ${opdId}.ordenInzoom (id duplicado entre bandas: ${sub})`);
      vistos.add(sub);
      fila.push(sub);
    }
    bandas.push(fila);
  }
  return ok(bandas);
}

function validarVistaOpd(opdId: Id, value: unknown): Resultado<OpdVista | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`OPD inválido: ${opdId}.vista`);
  if (value.kind === "requirement-view") {
    if (typeof value.requisitoEntidadId !== "string" || value.readOnly !== true) {
      return fallo(`OPD inválido: ${opdId}.vista`);
    }
    return ok({ kind: "requirement-view", requisitoEntidadId: value.requisitoEntidadId, readOnly: true });
  }
  if (value.kind === "submodel-view") {
    if (
      typeof value.submodeloRefId !== "string" ||
      value.readOnly !== true ||
      !esEstadoCargaSubmodelo(value.syncState)
    ) {
      return fallo(`OPD inválido: ${opdId}.vista`);
    }
    return ok({ kind: "submodel-view", submodeloRefId: value.submodeloRefId, readOnly: true, syncState: value.syncState });
  }
  if (value.kind === "generic-view") {
    // Vista ad-hoc (E-1): sin refs obligatorias. `readOnly` opcional (boolean).
    if (value.readOnly !== undefined && typeof value.readOnly !== "boolean") {
      return fallo(`OPD inválido: ${opdId}.vista`);
    }
    return ok({ kind: "generic-view", ...(value.readOnly !== undefined ? { readOnly: value.readOnly } : {}) });
  }
  return fallo(`OPD inválido: ${opdId}.vista.kind`);
}

function esEstadoCargaSubmodelo(value: unknown): value is EstadoCargaSubmodelo {
  return value === "descargado" || value === "cargado-sincronizado" || value === "cargado-no-sincronizado" || value === "desconectado";
}
