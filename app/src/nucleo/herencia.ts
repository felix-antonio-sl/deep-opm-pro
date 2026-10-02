import type { Modelo, Id } from './tipos';
export function generales(m: Modelo, cosa: Id): readonly Id[] {
    const vistos = new Set<Id>([cosa]);
    const lista: Id[] = [];
    const visitar = (id: Id) => {
        for (const e of Object.values(m.enlaces)) {
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
