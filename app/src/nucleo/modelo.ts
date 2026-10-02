import type { Id, Modelo, UnidadTiempo } from './tipos';
import type { Operacion } from './resultado';
import { transaccion } from './resultado';
export function crearModelo(a: {
    readonly id: Id;
    readonly nombre: string;
}): Modelo { return { id: a.id, nombre: a.nombre, unidadTiempo: 'min', raiz: 'opd-1', cosas: {}, enlaces: {}, abanicos: {}, opds: { 'opd-1': { id: 'opd-1', tipo: 'raiz', apariciones: {} } }, secuencia: 2 }; }
export const renombrarModelo: Operacion<{
    nombre: string;
}> = (m, a) => transaccion(m, tx => tx.modelo({ nombre: a.nombre }));
export const fijarUnidadTiempo: Operacion<{
    unidad: UnidadTiempo;
}> = (m, a) => transaccion(m, tx => tx.modelo({ unidadTiempo: a.unidad }));
export const fijarDescripcionModelo: Operacion<{
    texto: string | null;
}> = (m, a) => {
    if (a.texto !== null) {
        const texto = a.texto;
        return transaccion(m, tx => tx.modelo({ descripcion: texto }));
    }
    const { descripcion, ...sinDescripcion } = m;
    void descripcion;
    return transaccion(sinDescripcion, () => { });
};
