import type { Id, Modelo } from "../tipos";
import type { Compartidas } from "./componer";

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
