import type { Modelo, Id, Ref } from './tipos';
import type { Respuesta, Hecho } from './resultado';
import { renombrarModelo, fijarUnidadTiempo, fijarDescripcionModelo } from './modelo';
import { crearCosa, renombrarCosa, cambiarTipoCosa, fijarEsencia, fijarAfiliacion, fijarGenero, fijarDescripcion, fijarValor, fijarDuracion, fijarIncompleta, traerCosa, moverApariciones, redimensionar, quitarDeOpd, eliminarCosas } from './cosas';
import { agregarEstado, renombrarEstado, moverEstado, eliminarEstado, designar, suprimirEstado } from './estados';
import { crearEnlace, cambiarTipoEnlace, fijarEstados, fijarControl, fijarEtiqueta, fijarRuta, fijarMultiplicidad, reanclarExtremo, distribuirEnlace, eliminarEnlaces } from './enlaces';
import { formarAbanico, fijarOperador, agregarRama, quitarRama, disolverAbanico, fijarControlAbanico } from './abanicos';
import { descomponer, agregarSubprocesos, moverSubproceso, fijarBandas, desplegar, agregarRefinadores, eliminarRefinamiento } from './refinamiento';
export interface ExtremoRef {
    readonly cosa: Id;
    readonly estado?: Id;
}
export type EstadosEnlace = {
    readonly estado: Id | null;
} // consumo, resultado, agente, instrumento
 | {
    readonly entrada: Id | null;
    readonly salida: Id | null;
} // efecto
 | {
    readonly generalizacion: {
        readonly general: Id;
        readonly especializacion: Id;
    } | null;
} | {
    readonly origen: Id | null;
    readonly destino: Id | null;
}; // etiquetados
export const OPERACIONES = { renombrarModelo, fijarUnidadTiempo, fijarDescripcionModelo, crearCosa, renombrarCosa,
    cambiarTipoCosa, fijarEsencia, fijarAfiliacion, fijarGenero, fijarDescripcion, fijarValor, fijarDuracion, fijarIncompleta,
    traerCosa, moverApariciones, redimensionar, quitarDeOpd, eliminarCosas, agregarEstado, renombrarEstado, moverEstado,
    eliminarEstado, designar, suprimirEstado, crearEnlace, cambiarTipoEnlace, fijarEstados, fijarControl, fijarEtiqueta,
    fijarRuta, fijarMultiplicidad, reanclarExtremo, distribuirEnlace, eliminarEnlaces, formarAbanico, fijarOperador,
    agregarRama, quitarRama, disolverAbanico, fijarControlAbanico, descomponer, agregarSubprocesos, moverSubproceso,
    fijarBandas, desplegar, agregarRefinadores, eliminarRefinamiento } as const;
export type NombreOperacion = keyof typeof OPERACIONES;
export type ArgsDe<K extends NombreOperacion> = Parameters<(typeof OPERACIONES)[K]>[1];
export type Accion = {
    [K in NombreOperacion]: {
        readonly op: K;
        readonly args: ArgsDe<K>;
    };
}[NombreOperacion];
export interface Coincidencia {
    readonly ref: Ref;
    readonly texto: string;
    readonly detalle: string;
}
export function aplicarAccion(m: Modelo, a: Accion): Respuesta<Hecho> {
    switch (a.op) {
        case 'renombrarModelo': return OPERACIONES.renombrarModelo(m, a.args);
        case 'fijarUnidadTiempo': return OPERACIONES.fijarUnidadTiempo(m, a.args);
        case 'fijarDescripcionModelo': return OPERACIONES.fijarDescripcionModelo(m, a.args);
        case 'crearCosa': return OPERACIONES.crearCosa(m, a.args);
        case 'renombrarCosa': return OPERACIONES.renombrarCosa(m, a.args);
        case 'cambiarTipoCosa': return OPERACIONES.cambiarTipoCosa(m, a.args);
        case 'fijarEsencia': return OPERACIONES.fijarEsencia(m, a.args);
        case 'fijarAfiliacion': return OPERACIONES.fijarAfiliacion(m, a.args);
        case 'fijarGenero': return OPERACIONES.fijarGenero(m, a.args);
        case 'fijarDescripcion': return OPERACIONES.fijarDescripcion(m, a.args);
        case 'fijarValor': return OPERACIONES.fijarValor(m, a.args);
        case 'fijarDuracion': return OPERACIONES.fijarDuracion(m, a.args);
        case 'fijarIncompleta': return OPERACIONES.fijarIncompleta(m, a.args);
        case 'traerCosa': return OPERACIONES.traerCosa(m, a.args);
        case 'moverApariciones': return OPERACIONES.moverApariciones(m, a.args);
        case 'redimensionar': return OPERACIONES.redimensionar(m, a.args);
        case 'quitarDeOpd': return OPERACIONES.quitarDeOpd(m, a.args);
        case 'eliminarCosas': return OPERACIONES.eliminarCosas(m, a.args);
        case 'agregarEstado': return OPERACIONES.agregarEstado(m, a.args);
        case 'renombrarEstado': return OPERACIONES.renombrarEstado(m, a.args);
        case 'moverEstado': return OPERACIONES.moverEstado(m, a.args);
        case 'eliminarEstado': return OPERACIONES.eliminarEstado(m, a.args);
        case 'designar': return OPERACIONES.designar(m, a.args);
        case 'suprimirEstado': return OPERACIONES.suprimirEstado(m, a.args);
        case 'crearEnlace': return OPERACIONES.crearEnlace(m, a.args);
        case 'cambiarTipoEnlace': return OPERACIONES.cambiarTipoEnlace(m, a.args);
        case 'fijarEstados': return OPERACIONES.fijarEstados(m, a.args);
        case 'fijarControl': return OPERACIONES.fijarControl(m, a.args);
        case 'fijarEtiqueta': return OPERACIONES.fijarEtiqueta(m, a.args);
        case 'fijarRuta': return OPERACIONES.fijarRuta(m, a.args);
        case 'fijarMultiplicidad': return OPERACIONES.fijarMultiplicidad(m, a.args);
        case 'reanclarExtremo': return OPERACIONES.reanclarExtremo(m, a.args);
        case 'distribuirEnlace': return OPERACIONES.distribuirEnlace(m, a.args);
        case 'eliminarEnlaces': return OPERACIONES.eliminarEnlaces(m, a.args);
        case 'formarAbanico': return OPERACIONES.formarAbanico(m, a.args);
        case 'fijarOperador': return OPERACIONES.fijarOperador(m, a.args);
        case 'agregarRama': return OPERACIONES.agregarRama(m, a.args);
        case 'quitarRama': return OPERACIONES.quitarRama(m, a.args);
        case 'disolverAbanico': return OPERACIONES.disolverAbanico(m, a.args);
        case 'fijarControlAbanico': return OPERACIONES.fijarControlAbanico(m, a.args);
        case 'descomponer': return OPERACIONES.descomponer(m, a.args);
        case 'agregarSubprocesos': return OPERACIONES.agregarSubprocesos(m, a.args);
        case 'moverSubproceso': return OPERACIONES.moverSubproceso(m, a.args);
        case 'fijarBandas': return OPERACIONES.fijarBandas(m, a.args);
        case 'desplegar': return OPERACIONES.desplegar(m, a.args);
        case 'agregarRefinadores': return OPERACIONES.agregarRefinadores(m, a.args);
        case 'eliminarRefinamiento': return OPERACIONES.eliminarRefinamiento(m, a.args);
    }
}
export function aplicarAcciones(m: Modelo, as: readonly Accion[]): Respuesta<Hecho> {
    let actual = m;
    const creados: Id[] = [], trazas: import('./resultado').Traza[] = [];
    for (const a of as) {
        const r = aplicarAccion(actual, a);
        if (!r.ok)
            return r;
        actual = r.valor.modelo;
        creados.push(...r.valor.creados);
        trazas.push(...r.trazas);
    }
    return { ok: true, valor: { modelo: actual, creados }, trazas };
}
const ETIQUETAS: Readonly<Record<NombreOperacion, string>> = {
    renombrarModelo: 'Renombrar modelo', fijarUnidadTiempo: 'Fijar unidad de tiempo', fijarDescripcionModelo: 'Fijar descripción del modelo',
    crearCosa: 'Crear cosa', renombrarCosa: 'Renombrar cosa', cambiarTipoCosa: 'Cambiar tipo de cosa', fijarEsencia: 'Fijar esencia', fijarAfiliacion: 'Fijar afiliación', fijarGenero: 'Fijar género', fijarDescripcion: 'Fijar descripción', fijarValor: 'Fijar valor', fijarDuracion: 'Fijar duración', fijarIncompleta: 'Declarar colección incompleta', traerCosa: 'Traer cosa', moverApariciones: 'Mover apariciones', redimensionar: 'Redimensionar', quitarDeOpd: 'Quitar del OPD', eliminarCosas: 'Eliminar cosas',
    agregarEstado: 'Agregar estado', renombrarEstado: 'Renombrar estado', moverEstado: 'Mover estado', eliminarEstado: 'Eliminar estado', designar: 'Designar estado', suprimirEstado: 'Suprimir estado',
    crearEnlace: 'Crear enlace', cambiarTipoEnlace: 'Cambiar tipo de enlace', fijarEstados: 'Fijar estados del enlace', fijarControl: 'Fijar control', fijarEtiqueta: 'Fijar etiqueta', fijarRuta: 'Fijar ruta', fijarMultiplicidad: 'Fijar multiplicidad', reanclarExtremo: 'Reanclar extremo', distribuirEnlace: 'Distribuir enlace', eliminarEnlaces: 'Eliminar enlaces',
    formarAbanico: 'Formar abanico', fijarOperador: 'Fijar operador', agregarRama: 'Agregar rama', quitarRama: 'Quitar rama', disolverAbanico: 'Disolver abanico', fijarControlAbanico: 'Fijar control del abanico',
    descomponer: 'Descomponer', agregarSubprocesos: 'Agregar subprocesos', moverSubproceso: 'Mover subproceso', fijarBandas: 'Fijar bandas', desplegar: 'Desplegar', agregarRefinadores: 'Agregar refinadores', eliminarRefinamiento: 'Eliminar refinamiento',
};
export function etiquetaAccion(m: Modelo, a: Accion): string {
    const args = a.args;
    const id = 'cosa' in args ? args.cosa : 'proceso' in args ? args.proceso : 'objeto' in args ? args.objeto : null;
    const c = id ? m.cosas[id] : undefined;
    const nombre = c ? c.tipo === 'objeto' ? ` **${c.nombre}**` : ` *${c.nombre}*` : '';
    return ETIQUETAS[a.op] + nombre;
}
