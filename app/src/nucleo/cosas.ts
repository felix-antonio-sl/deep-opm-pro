import type { Id, Modelo, TipoCosa, Esencia, Afiliacion, UnidadTiempo, Duracion, RelacionIncompleta, Designacion, EnlaceNuevo, Operador, TipoEnlace, Control, Multiplicidad, ModoDespliegue } from './tipos';
import type { Operacion } from './resultado';
import type { EstadosEnlace, ExtremoRef } from './operaciones';
export const crearCosa: Operacion<{
    opd: Id;
    tipo: TipoCosa;
    nombre: string;
    x: number;
    y: number;
    banda?: {
        indice: number;
        paralelo: boolean;
    };
    alcance?: 'interno' | 'externo';
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const renombrarCosa: Operacion<{
    cosa: Id;
    nombre: string;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const cambiarTipoCosa: Operacion<{
    cosa: Id;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarEsencia: Operacion<{
    cosa: Id;
    esencia: Esencia;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarAfiliacion: Operacion<{
    cosa: Id;
    afiliacion: Afiliacion;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarGenero: Operacion<{
    cosa: Id;
    genero: 'm' | 'f';
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarDescripcion: Operacion<{
    cosa: Id;
    texto: string | null;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarValor: Operacion<{
    objeto: Id;
    valor: string | null;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarDuracion: Operacion<{
    proceso: Id;
    duracion: Duracion | null;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const fijarIncompleta: Operacion<{
    cosa: Id;
    relacion: RelacionIncompleta;
    activa: boolean;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const traerCosa: Operacion<{
    cosa: Id;
    opd: Id;
    x: number;
    y: number;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const moverApariciones: Operacion<{
    opd: Id;
    mover: readonly {
        cosa: Id;
        x: number;
        y: number;
    }[];
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const redimensionar: Operacion<{
    opd: Id;
    cosa: Id;
    ancho: number;
    alto: number;
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const quitarDeOpd: Operacion<{
    opd: Id;
    cosas: readonly Id[];
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
export const eliminarCosas: Operacion<{
    cosas: readonly Id[];
}> = () => { throw new Error('pendiente: paquete propietario de cosas'); };
