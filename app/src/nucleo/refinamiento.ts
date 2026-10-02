import type { Id, Modelo, TipoCosa, Esencia, Afiliacion, UnidadTiempo, Duracion, RelacionIncompleta, Designacion, EnlaceNuevo, Operador, TipoEnlace, Control, Multiplicidad, ModoDespliegue } from './tipos';
import type { Operacion } from './resultado';
import type { EstadosEnlace, ExtremoRef } from './operaciones';
export const descomponer: Operacion<{
    opd: Id;
    proceso: Id;
    bandas?: readonly (readonly string[])[];
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
export const agregarSubprocesos: Operacion<{
    opd: Id;
    bandas: readonly (readonly string[])[];
    posicion: 'final' | {
        antesDeBanda: number;
    } | {
        enBanda: number;
    };
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
export const moverSubproceso: Operacion<{
    opd: Id;
    proceso: Id;
    destino: {
        banda: number;
    } | {
        nuevaBandaAntesDe: number;
    };
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
export const fijarBandas: Operacion<{
    opd: Id;
    bandas: readonly (readonly Id[])[];
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
export const desplegar: Operacion<{
    opd: Id;
    cosa: Id;
    modo: ModoDespliegue;
    refinadores?: readonly string[];
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
export const agregarRefinadores: Operacion<{
    opd: Id;
    nombres: readonly string[];
    tipo?: TipoCosa;
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
export const eliminarRefinamiento: Operacion<{
    opd: Id;
}> = () => { throw new Error('pendiente: paquete propietario de refinamiento'); };
