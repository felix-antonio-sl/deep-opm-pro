import type { Modelo } from '../nucleo/tipos';
import { congelar, modeloCon } from './constructores';
export function azar(semilla: number, perfil: 'estricto' | 'completo' | 'hodom' = 'estricto'): Modelo { if (perfil === 'hodom') return hodom(semilla); let s = semilla >>> 0; const n = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s; }; const objetos = Array.from({ length: 1 + n() % 6 }, (_, i) => [`Objeto_${i}`, Array.from({ length: n() % 4 }, (_, j) => `estado_${j}`)] as const); const procesos = Array.from({ length: 1 + n() % 5 }, (_, i) => `Procesar_${i}`); const enlaces = objetos.map(([nombre], i) => [perfil === 'completo' && i % 2 ? 'instrumento' as const : 'consumo' as const, nombre, procesos[i % procesos.length]!] as const); return modeloCon({ objetos, procesos, enlaces }); }

import type { Accion } from '../nucleo/operaciones';
// La lista se construye con la estructura actual, sin ejecutar/filtrar operaciones.
// La secuencia elige una sola acción y conserva también sus rechazos.
export namespace azar {
    export function acciones(m: Modelo): readonly Accion[] {
        const nombre = `Nuevo_${m.secuencia}`, acciones: Accion[] = [
            { op: 'crearCosa', args: { opd: m.raiz, tipo: 'objeto', nombre, x: 0, y: 400 } },
            { op: 'crearCosa', args: { opd: m.raiz, tipo: 'proceso', nombre, x: 250, y: 400 } },
        ];
        for (const c of Object.values(m.cosas)) {
            acciones.push({ op: 'renombrarCosa', args: { cosa: c.id, nombre } }, { op: 'fijarAfiliacion', args: { cosa: c.id, afiliacion: c.afiliacion === 'ambiental' ? 'sistemica' : 'ambiental' } }, { op: 'fijarEsencia', args: { cosa: c.id, esencia: c.esencia === 'fisica' ? 'informacional' : 'fisica' } });
            if (c.tipo === 'objeto') {
                acciones.push({ op: 'agregarEstado', args: { objeto: c.id, nombre: `estado_${m.secuencia}` } });
                for (const s of c.estados) acciones.push({ op: 'renombrarEstado', args: { estado: s.id, nombre: `estado_${m.secuencia}` } }, { op: 'eliminarEstado', args: { estado: s.id } });
            }
        }
        for (const o of Object.values(m.opds)) {
            for (const id of Object.keys(o.apariciones)) {
                if (m.cosas[id]!.tipo === 'proceso') acciones.push({ op: 'descomponer', args: { opd: o.id, proceso: id } }, { op: 'descomponer', args: { opd: o.id, proceso: id, bandas: [[`Recibir_${m.secuencia}`], [`Entregar_${m.secuencia}`]] } });
                for (const modo of ['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'] as const) acciones.push({ op: 'desplegar', args: { opd: o.id, cosa: id, modo } });
            }
            const objetos = Object.keys(o.apariciones).filter(id => m.cosas[id]!.tipo === 'objeto'), procesos = Object.keys(o.apariciones).filter(id => m.cosas[id]!.tipo === 'proceso');
            for (const objeto of objetos.slice(0, 2)) for (const proceso of procesos.slice(0, 2)) {
                for (const tipo of ['consumo', 'resultado', 'efecto', 'instrumento'] as const) acciones.push({ op: 'crearEnlace', args: { opd: o.id, candidato: { tipo, objeto, proceso } } });
            }
            if (o.tipo === 'descomposicion') {
                acciones.push({ op: 'agregarSubprocesos', args: { opd: o.id, bandas: [[`Refinar_${m.secuencia}`]], posicion: 'final' } }, { op: 'fijarBandas', args: { opd: o.id, bandas: o.bandas } });
                // Movimiento dentro de la misma banda: el orden temporal permanece igual.
                for (const [banda, ids] of o.bandas.entries()) for (const proceso of ids) acciones.push({ op: 'moverSubproceso', args: { opd: o.id, proceso, destino: { banda } } });
                acciones.push({ op: 'crearCosa', args: { opd: o.id, tipo: 'proceso', nombre, x: 140, y: 80, alcance: 'interno' } }, { op: 'crearCosa', args: { opd: o.id, tipo: 'objeto', nombre, x: 140, y: 80, alcance: 'interno' } });
            }
            if (o.tipo === 'despliegue') acciones.push({ op: 'agregarRefinadores', args: { opd: o.id, nombres: [nombre] } });
            if (o.tipo !== 'raiz') acciones.push({ op: 'eliminarRefinamiento', args: { opd: o.id } });
        }
        for (const e of Object.values(m.enlaces)) acciones.push({ op: 'distribuirEnlace', args: { enlace: e.id } }, { op: 'fijarControl', args: { enlace: e.id, control: 'c' } }, { op: 'eliminarEnlaces', args: { enlaces: [e.id] } });
        return acciones;
    }
}

// §2.4: raíz con 5 procesos; 5 hijos con 6 subprocesos; 30 hojas con
// 2 subprocesos y 5/6 objetos internos. Todas las bandas y filas son reales.
function hodom(semilla: number): Modelo {
    let aleatorio = semilla >>> 0, secuencia = 1;
    const siguiente = () => aleatorio = (Math.imul(aleatorio, 1664525) + 1013904223) >>> 0;
    const id = (tipo: string) => `${tipo}-${secuencia++}`;
    const cosas: Record<string, import('../nucleo/tipos').Cosa> = {};
    const enlaces: Record<string, import('../nucleo/tipos').Enlace> = {};
    const opds: Record<string, import('../nucleo/tipos').Opd> = {};
    const proceso = () => { const p = id('p'); cosas[p] = { id: p, tipo: 'proceso', nombre: `Procesar_${p.slice(2)}`, esencia: 'informacional', afiliacion: 'sistemica' }; return p; };
    const posicion = (i: number) => ({ x: (i % 4) * 240 + siguiente() % 15, y: Math.floor(i / 4) * 170 + siguiente() % 15, ancho: 180, alto: 110 });
    const apariciones = (ids: readonly string[]) => Object.fromEntries(ids.map((p, i) => [p, posicion(i)]));
    const raiz = id('opd'), padres = Array.from({ length: 5 }, proceso);
    opds[raiz] = { id: raiz, tipo: 'raiz', apariciones: apariciones(padres) };
    let hoja = 0, estados = 0, estructurales = 0;
    for (const [orden, padre] of padres.entries()) {
        const hijo = id('opd'), partes = Array.from({ length: 6 }, proceso);
        opds[hijo] = { id: hijo, tipo: 'descomposicion', padre: raiz, cosa: padre, orden, bandas: [partes], objetosInternos: [], apariciones: apariciones([padre, ...partes]) };
        for (const [ordenHoja, parte] of partes.entries()) {
            const opd = id('opd'), procesos = Array.from({ length: 2 }, proceso), objetos: string[] = [];
            for (let i = 0; i < (hoja < 17 ? 6 : 5); i++) {
                const objeto = id('o');
                const ss = Array.from({ length: estados < 50 ? 2 : 1 }, (_, j) => ({ id: id('s'), nombre: j ? 'listo' : 'pendiente' }));
                estados += ss.length;
                cosas[objeto] = { id: objeto, tipo: 'objeto', nombre: `Registro_${objeto.slice(2)}`, esencia: 'fisica', afiliacion: 'sistemica', estados: ss };
                objetos.push(objeto);
                for (const [tipo, p] of [['consumo', procesos[0]!], ['resultado', procesos[1]!]] as const) {
                    const e = id('e'); enlaces[e] = { id: e, tipo, objeto, proceso: p, estado: ss[tipo === 'resultado' ? ss.length - 1 : 0]!.id };
                }
            }
            for (let i = 1; i < objetos.length && estructurales < 99; i++, estructurales++) {
                const e = id('e'); enlaces[e] = { id: e, tipo: 'agregacion', refinable: objetos[0]!, refinador: objetos[i]! };
            }
            opds[opd] = { id: opd, tipo: 'descomposicion', padre: hijo, cosa: parte, orden: ordenHoja, bandas: procesos.map(p => [p]), objetosInternos: objetos, apariciones: apariciones([parte, ...procesos, ...objetos]) };
            hoja++;
        }
    }
    return congelar({ id: 'm-hodom', nombre: 'HODOM', unidadTiempo: 'min', raiz, cosas, enlaces, abanicos: {}, opds, secuencia });
}
