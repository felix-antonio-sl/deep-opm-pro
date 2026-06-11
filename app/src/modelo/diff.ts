import type { Id, Modelo } from "./tipos";

export interface CambioModelo {
  tipo: "agregado" | "eliminado" | "modificado";
  coleccion: "entidades" | "estados" | "enlaces" | "opds";
  id: Id;
}

export function diffModelos(a: Modelo, b: Modelo): CambioModelo[] {
  return [
    ...diffColeccion("entidades", a.entidades, b.entidades),
    ...diffColeccion("estados", a.estados, b.estados),
    ...diffColeccion("enlaces", a.enlaces, b.enlaces),
    ...diffColeccion("opds", a.opds, b.opds),
  ];
}

function diffColeccion(
  coleccion: CambioModelo["coleccion"],
  a: Record<Id, unknown>,
  b: Record<Id, unknown>,
): CambioModelo[] {
  const cambios: CambioModelo[] = [];
  const ids = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const id of [...ids].sort()) {
    if (!(id in a)) cambios.push({ tipo: "agregado", coleccion, id });
    else if (!(id in b)) cambios.push({ tipo: "eliminado", coleccion, id });
    else if (JSON.stringify(a[id]) !== JSON.stringify(b[id])) cambios.push({ tipo: "modificado", coleccion, id });
  }
  return cambios;
}
