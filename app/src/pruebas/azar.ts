import type { Modelo } from '../nucleo/tipos';
import { modeloCon } from './constructores';
export function azar(semilla: number, perfil: 'estricto' | 'completo' = 'estricto'): Modelo { let s = semilla >>> 0; const n = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s; }; const objetos = Array.from({ length: 1 + n() % 6 }, (_, i) => [`Objeto_${i}`, Array.from({ length: n() % 4 }, (_, j) => `estado_${j}`)] as const); const procesos = Array.from({ length: 1 + n() % 5 }, (_, i) => `Procesar_${i}`); const enlaces = objetos.map(([nombre], i) => [perfil === 'completo' && i % 2 ? 'instrumento' as const : 'consumo' as const, nombre, procesos[i % procesos.length]!] as const); return modeloCon({ objetos, procesos, enlaces }); }

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
