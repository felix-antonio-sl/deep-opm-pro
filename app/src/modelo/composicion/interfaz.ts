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
    const mismaIdentidad = a.entidades[entidadB.id];
    if (mismaIdentidad?.tipo === entidadB.tipo) {
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
