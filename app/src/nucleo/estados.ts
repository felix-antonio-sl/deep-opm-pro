import type { Id, Modelo, TipoCosa, Esencia, Afiliacion, UnidadTiempo, Duracion, RelacionIncompleta, Designacion, EnlaceNuevo, Operador, TipoEnlace, Control, Multiplicidad, ModoDespliegue } from './tipos';
import type { Operacion } from './resultado';
import type { EstadosEnlace, ExtremoRef } from './operaciones';
export const agregarEstado: Operacion<{
    objeto: Id;
    nombre: string;
    indice?: number;
}> = () => { throw new Error('pendiente: paquete propietario de estados'); };
export const renombrarEstado: Operacion<{
    estado: Id;
    nombre: string;
}> = () => { throw new Error('pendiente: paquete propietario de estados'); };
export const moverEstado: Operacion<{
    estado: Id;
    indice: number;
}> = () => { throw new Error('pendiente: paquete propietario de estados'); };
export const eliminarEstado: Operacion<{
    estado: Id;
}> = () => { throw new Error('pendiente: paquete propietario de estados'); };
export const designar: Operacion<{
    estado: Id;
    designacion: Designacion;
    activa: boolean;
}> = () => { throw new Error('pendiente: paquete propietario de estados'); };
export const suprimirEstado: Operacion<{
    estado: Id;
    opd: Id | null;
    activa: boolean;
}> = () => { throw new Error('pendiente: paquete propietario de estados'); };
