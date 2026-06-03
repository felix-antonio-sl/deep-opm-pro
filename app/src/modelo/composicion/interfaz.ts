import type { Id, Modelo } from "../tipos";
import { componerModelos, type Compartidas } from "./componer";
import { verificarLinealidad } from "./linealidad";

function claveInterfaz(nombre: string): string {
  return nombre.trim().toLocaleLowerCase("es-CL").replace(/\s+/g, " ");
}

export function sugerirCompartidasPorInterfaz(a: Modelo, b: Modelo): Compartidas {
  const compartidas: Compartidas = {};
  const usadosA = new Set<Id>();
  const entidadesA = Object.values(a.entidades);

  for (const entidadB of Object.values(b.entidades)) {
    // Identidad por id: SOLO vale si el nombre también coincide. Los ids de
    // opforja son secuenciales por modelo (o-1, p-1…), así que dos modelos
    // independientes del catálogo casi siempre colisionan en id sin ser la
    // misma entidad. Exigir nombre igual preserva el caso versión/derivado
    // (mismo id + mismo nombre) y descarta la fusión falsa por id coincidente.
    const mismaIdentidad = a.entidades[entidadB.id];
    if (
      mismaIdentidad?.tipo === entidadB.tipo &&
      claveInterfaz(mismaIdentidad.nombre) === claveInterfaz(entidadB.nombre)
    ) {
      compartidas[entidadB.id] = mismaIdentidad.id;
      usadosA.add(mismaIdentidad.id);
      continue;
    }

    const claveB = claveInterfaz(entidadB.nombre);
    const candidatas = entidadesA.filter((entidadA) =>
      entidadA.tipo === entidadB.tipo &&
      !usadosA.has(entidadA.id) &&
      claveInterfaz(entidadA.nombre) === claveB
    );
    if (candidatas.length !== 1) continue;
    compartidas[entidadB.id] = candidatas[0]!.id;
    usadosA.add(candidatas[0]!.id);
  }

  return compartidas;
}

export interface ResumenComposicion {
  /** Entidades que entran al compuesto que no estaban en A (B menos las compartidas). */
  entidadesNuevas: number;
  enlacesNuevos: number;
  compartidas: number;
  /** Conflictos de recurso lineal que la fusión introduciría (objeto lineal multi-consumido). */
  conflictosLineal: number;
}

/**
 * Preview del delta de componer A con B, SIN mutar nada. Permite mostrar al
 * usuario qué cambia antes de confirmar (anti Generation Surprise; jobs-web-ux
 * trazabilidad de la generación). Devuelve null si la composición sería inválida.
 */
export function resumenComposicion(a: Modelo, b: Modelo, compartidas: Compartidas): ResumenComposicion | null {
  const resultado = componerModelos(a, b, compartidas);
  if (!resultado.ok) return null;
  const compuesto = resultado.value;
  return {
    entidadesNuevas: Object.keys(compuesto.entidades).length - Object.keys(a.entidades).length,
    enlacesNuevos: Object.keys(compuesto.enlaces).length - Object.keys(a.enlaces).length,
    compartidas: Object.keys(compartidas).length,
    conflictosLineal: verificarLinealidad(compuesto).filter((o) => o.severidad === "error-linealidad").length,
  };
}
