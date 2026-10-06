import type { Modelo, Id } from './tipos';
import { indice } from './indice';
export function generales(m: Modelo, cosa: Id): readonly Id[] {
    const idx = indice(m);
    const vistos = new Set<Id>([cosa]);
    const lista: Id[] = [];
    const visitar = (id: Id) => {
        for (const enlace of idx.enlacesDeCosa.get(id) ?? []) {
            const e = m.enlaces[enlace]!;
            if (e.tipo === 'generalizacion' && e.refinador === id && !vistos.has(e.refinable)) {
                vistos.add(e.refinable);
                lista.push(e.refinable);
                visitar(e.refinable);
            }
        }
    };
    visitar(cosa);
    return lista;
}
