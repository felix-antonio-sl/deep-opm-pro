import type { Id, Modelo, TipoCosa, Esencia, Afiliacion, UnidadTiempo, Duracion, RelacionIncompleta, Designacion, EnlaceNuevo, Operador, TipoEnlace, Control, Multiplicidad, ModoDespliegue } from './tipos';
import type { Operacion } from './resultado';
import type { EstadosEnlace, ExtremoRef } from './operaciones';
export const crearEnlace: Operacion<{
    opd: Id;
    candidato: EnlaceNuevo;
    abanicoCon?: {
        enlace: Id;
        operador: Operador;
    };
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const cambiarTipoEnlace: Operacion<{
    enlace: Id;
    tipo: TipoEnlace;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const fijarEstados: Operacion<{
    enlace: Id;
    estados: EstadosEnlace;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const fijarControl: Operacion<{
    enlace: Id;
    control: Control | null;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const fijarEtiqueta: Operacion<{
    enlace: Id;
    etiqueta: string | null;
    inversa?: string | null;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const fijarRuta: Operacion<{
    enlace: Id;
    ruta: string | null;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const fijarMultiplicidad: Operacion<{
    enlace: Id;
    extremo: 'objeto' | 'refinador' | 'origen' | 'destino';
    valor: Multiplicidad | null;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const reanclarExtremo: Operacion<{
    opd: Id;
    enlace: Id;
    extremo: 'origen' | 'destino';
    hacia: ExtremoRef;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const distribuirEnlace: Operacion<{
    enlace: Id;
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
export const eliminarEnlaces: Operacion<{
    enlaces: readonly Id[];
}> = () => { throw new Error('pendiente: paquete propietario de enlaces'); };
