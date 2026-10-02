import type { Id, Modelo, TipoCosa, Esencia, Afiliacion, UnidadTiempo, Duracion, RelacionIncompleta, Designacion, EnlaceNuevo, Operador, TipoEnlace, Control, Multiplicidad, ModoDespliegue } from './tipos';
import type { Operacion } from './resultado';
import type { EstadosEnlace, ExtremoRef } from './operaciones';
export const formarAbanico: Operacion<{
    enlaces: readonly Id[];
    operador: Operador;
}> = () => { throw new Error('pendiente: paquete propietario de abanicos'); };
export const fijarOperador: Operacion<{
    abanico: Id;
    operador: Operador;
}> = () => { throw new Error('pendiente: paquete propietario de abanicos'); };
export const agregarRama: Operacion<{
    abanico: Id;
    enlace: Id;
}> = () => { throw new Error('pendiente: paquete propietario de abanicos'); };
export const quitarRama: Operacion<{
    abanico: Id;
    enlace: Id;
}> = () => { throw new Error('pendiente: paquete propietario de abanicos'); };
export const disolverAbanico: Operacion<{
    abanico: Id;
}> = () => { throw new Error('pendiente: paquete propietario de abanicos'); };
export const fijarControlAbanico: Operacion<{
    abanico: Id;
    control: Control | null;
}> = () => { throw new Error('pendiente: paquete propietario de abanicos'); };
