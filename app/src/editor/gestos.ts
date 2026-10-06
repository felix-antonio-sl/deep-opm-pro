import type { Camara } from './estado';
import { indice } from '../nucleo/indice';
import { tiposLegales, MATRIZ } from '../nucleo/matriz';
import { validarNombreCosa, validarNombreEstado } from '../nucleo/lexico';
import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
export type Gesto = ( {
    readonly k: 'reposo';
} | {
    readonly k: 'creando';
    readonly banda?: { readonly indice: number; readonly paralelo: boolean };
    readonly tipo: TipoCosa;
    readonly en: Punto;
    readonly nombre: string;
} | {
    readonly k: 'arrastrando';
    readonly cosas: readonly Id[];
    readonly desde: Punto;
    readonly delta: Punto;
} | {
    readonly k: 'redimensionando';
    readonly cosa: Id;
    readonly caja: Rect;
} | {
    readonly k: 'conectando';
    readonly desde: ExtremoRef;
    readonly punto: Punto;
    readonly sobre?: ExtremoRef;
} | {
    readonly k: 'menuTipo';
    readonly desde: ExtremoRef;
    readonly hacia: ExtremoRef;
    readonly opciones: readonly OpcionTipo[];
    readonly elegida?: number;
} | {
    readonly k: 'reanclando';
    readonly enlace: Id;
    readonly extremo: 'origen' | 'destino';
    readonly punto: Punto;
} | {
    readonly k: 'banda';
    readonly proceso: Id;
    readonly destino: {
        banda: number;
    } | {
        nuevaBandaAntesDe: number;
    } | null;
} | {
    readonly k: 'encadenando';
    readonly opd: Id;
    readonly bandas: readonly (readonly string[])[];
    readonly actual: string;
    readonly modo: 'subprocesos' | 'refinadores';
} | {
    readonly k: 'estado';
    readonly objeto: Id;
    readonly nombre: string;
} // estados: uno por gesto (DECISIONS 18, CC-20)
 | {
    readonly k: 'desplazando';
    readonly desde: Punto;
    readonly camara?: Camara;
}) & { readonly id?: string };
export type EventoLienzo = { readonly k: 'rueda'; readonly punto: Punto; readonly dx: number; readonly dy: number; readonly ctrl: boolean; readonly camara: Camara } | { readonly k: 'nombre'; readonly nombre: string; readonly confirmar?: boolean } | { readonly k: 'elegir'; readonly indice: number; readonly operador?: 'XOR' | 'OR' } | {
    readonly k: 'abajo' | 'mover' | 'arriba';
    readonly punto: Punto;
    readonly sobre?: string /* data-ref */;
    readonly mayus: boolean;
} | {
    readonly k: 'tecla';
    readonly tecla: string;
    readonly mayus: boolean;
    readonly ctrl: boolean;
    readonly alt: boolean;
};
export function reducirGesto(m: Modelo, opd: Id, g: Gesto, ev: EventoLienzo): {
    readonly gesto: Gesto; readonly acciones: readonly Accion[]; readonly gestoId?: string; readonly camara?: Camara;
} {
    const id = g.id ?? JSON.stringify([opd, m.secuencia, g, g.k === 'arrastrando' ? g.cosas.map(c => m.opds[opd]?.apariciones[c]) : g.k === 'redimensionando' ? m.opds[opd]?.apariciones[g.cosa] : null]);
    const salida = (gesto: Gesto, acciones: readonly Accion[] = []) => ({ gesto, acciones, ...(acciones.length ? { gestoId: id } : {}) });
    const reposo: Gesto = { k: 'reposo' };
    const tecla = ev.k === 'tecla' ? ev.tecla : '';
    if (tecla === 'Escape') {
        if (g.k === 'encadenando') return terminarCadena(g);
        return salida(reposo);
    }
    if (ev.k === 'rueda') {
        const c = ev.camara;
        if (!ev.ctrl) return { gesto: g, acciones: [], camara: { ...c, x: c.x - ev.dx, y: c.y - ev.dy } };
        const zoom = Math.max(.2, Math.min(3, c.zoom * (ev.dy < 0 ? 1.1 : 1 / 1.1))), razon = zoom / c.zoom;
        return { gesto: g, acciones: [], camara: { zoom, x: ev.punto.x - (ev.punto.x - c.x) * razon, y: ev.punto.y - (ev.punto.y - c.y) * razon } };
    }
    const extremo = (valor?: string): ExtremoRef | undefined => {
        if (!valor) return;
        const [tipo, ...partes] = valor.split(':'), ref = partes.length ? partes.join(':') : tipo!;
        if (tipo === 'estado') { const s = indice(m).estadoDe.get(ref); return s ? { cosa: s.objeto, estado: ref } : undefined; }
        return m.cosas[ref] ? { cosa: ref } : undefined;
    };
    if (g.k === 'creando') {
        const nombre = ev.k === 'nombre' ? ev.nombre : g.nombre;
        if (tecla === 'Tab') return salida({ ...g, tipo: g.tipo === 'objeto' ? 'proceso' : 'objeto' });
        if (tecla === 'Enter' || ev.k === 'nombre' && ev.confirmar) {
            if (validarNombreCosa(nombre)) return salida({ ...g, nombre });
            const siguiente: Gesto = ev.k === 'tecla' && ev.mayus ? { ...g, en:{x:g.en.x,y:g.en.y+100}, nombre: '', id: id + ':siguiente' } : reposo;
            return salida(siguiente, [{ op: 'crearCosa', args: { opd, tipo: g.tipo, nombre, x: g.en.x, y: g.en.y, ...(g.banda ? {banda:g.banda} : {}) } }]);
        }
        return salida({ ...g, nombre });
    }
    if (g.k === 'estado') {
        const nombre = ev.k === 'nombre' ? ev.nombre : g.nombre;
        if (tecla === 'Enter' || ev.k === 'nombre' && ev.confirmar) {
            if (validarNombreEstado(nombre)) return salida({ ...g, nombre });
            return salida(reposo, [{ op: 'agregarEstado', args: { objeto: g.objeto, nombre } }]);
        }
        return salida({ ...g, nombre });
    }
    if (g.k === 'arrastrando') {
        if (ev.k === 'mover') return salida({ ...g, delta: { x: ev.punto.x - g.desde.x, y: ev.punto.y - g.desde.y } });
        if (ev.k === 'arriba') {
            const o = m.opds[opd]!;
            return salida(reposo, [{ op: 'moverApariciones', args: { opd, mover: g.cosas.flatMap(cosa => { const a = o.apariciones[cosa]; if (!a) return []; const subproceso = indice(m).subprocesoDe.has(cosa); return [{ cosa, x: a.x + g.delta.x, y: a.y + (subproceso ? 0 : g.delta.y) }]; }) } }]);
        }
    }
    if (g.k === 'redimensionando' && ev.k === 'arriba') return salida(reposo, [{ op: 'redimensionar', args: { opd, cosa: g.cosa, ancho: g.caja.ancho, alto: g.caja.alto } }]);
    if (g.k === 'conectando') {
        if (tecla === 'Tab') {
            const destinos = Object.keys(m.opds[opd]!.apariciones).sort((a,b)=>m.cosas[a]!.nombre.localeCompare(m.cosas[b]!.nombre,'es')).filter(cosa=>tiposLegales(m,{opd,desde:g.desde,hacia:{cosa}}).some(o=>o.legal===true));
            const actual = destinos.indexOf(g.sobre?.cosa ?? ''), siguiente = destinos[(actual+1)%destinos.length];
            return siguiente ? salida({...g,sobre:{cosa:siguiente}}) : salida(g);
        }
        if (ev.k === 'mover') { const sobre = extremo(ev.sobre); const { sobre: viejo, ...resto } = g; return salida({ ...resto, punto: ev.punto, ...(sobre ? { sobre } : {}) }); }
        if (ev.k === 'arriba' || tecla === 'Enter') { const hacia = ev.k === 'arriba' ? extremo(ev.sobre) ?? g.sobre : g.sobre; if (!hacia) return salida(g); return salida({ k: 'menuTipo', desde: g.desde, hacia, opciones: tiposLegales(m, { opd, desde: g.desde, hacia }), id }); }
    }
    if (g.k === 'menuTipo') {
        if (tecla === 'ArrowUp' || tecla === 'ArrowDown') return salida({...g,elegida:Math.max(0,Math.min(g.opciones.length-1,(g.elegida??0)+(tecla==='ArrowDown'?1:-1)))});
        if (tecla === 'Enter' || /^[1-9]$/.test(tecla)) return reducirGesto(m,opd,g,{k:'elegir',indice:tecla==='Enter'?(g.elegida??0):Number(tecla)-1});
        if (tecla === 'Tab') return salida({ ...g, desde: g.hacia, hacia: g.desde, opciones: tiposLegales(m, { opd, desde: g.hacia, hacia: g.desde }) });
        if (ev.k === 'elegir') {
            const o = g.opciones[ev.indice];
            if (!o) return salida(g);
            if (o.legal === true) return salida(reposo, [{ op: 'crearEnlace', args: { opd, candidato: o.candidato } }]);
            if (o.legal === false && o.alternativa) {
                const a = o.alternativa;
                if (a.k === 'completarCambio') return salida(reposo, [{ op: 'fijarEstados', args: { enlace: a.enlace, estados: a.estados } }]);
                if (a.k === 'cambiarTipoExistente') return salida(reposo, [{ op: 'cambiarTipoEnlace', args: { enlace: a.enlace, tipo: o.tipo } }]);
                if (ev.operador && ['consumo', 'resultado', 'agente', 'instrumento'].includes(o.tipo)) {
                    const [desde, hacia] = o.sentido === 'directo' ? [g.desde, g.hacia] : [g.hacia, g.desde];
                    const roles = MATRIZ[o.tipo].roles, objeto = roles[0] === 'objeto' ? desde : hacia, proceso = roles[0] === 'objeto' ? hacia : desde;
                    if (['consumo', 'resultado', 'agente', 'instrumento'].includes(o.tipo)) return salida(reposo, [{ op: 'crearEnlace', args: { opd, candidato: { tipo: o.tipo as 'consumo' | 'resultado' | 'agente' | 'instrumento', objeto: objeto.cosa, proceso: proceso.cosa, ...(objeto.estado ? { estado: objeto.estado } : {}) }, abanicoCon: { enlace: a.enlace, operador: ev.operador } } }]);
                }
            }
            return salida(g);
        }
    }
    if (g.k === 'reanclando') {
        if (ev.k === 'mover') return salida({ ...g, punto: ev.punto });
        if (ev.k === 'arriba') { const hacia = extremo(ev.sobre); return hacia ? salida(reposo, [{ op: 'reanclarExtremo', args: { opd, enlace: g.enlace, extremo: g.extremo, hacia } }]) : salida(g); }
    }
    if (g.k === 'banda' && (ev.k === 'arriba' || tecla === 'Enter')) return g.destino ? salida(reposo, [{ op: 'moverSubproceso', args: { opd, proceso: g.proceso, destino: g.destino } }]) : salida(reposo);
    if (g.k === 'encadenando') {
        if (ev.k === 'nombre') return salida({ ...g, actual: ev.nombre });
        if (tecla === 'Enter') {
            if (!g.actual) return terminarCadena(g);
            if (validarNombreCosa(g.actual)) return salida(g);
            const bandas = g.bandas.map(b => [...b]);
            if (ev.k === 'tecla' && ev.mayus && bandas.length) bandas[bandas.length - 1]!.push(g.actual); else bandas.push([g.actual]);
            return salida({ ...g, bandas, actual: '' });
        }
    }
    if (g.k === 'desplazando') {
        if (ev.k === 'arriba') return salida(reposo);
        if (ev.k === 'mover' && g.camara) return { gesto: g, acciones: [], camara: { ...g.camara, x: g.camara.x + ev.punto.x - g.desde.x, y: g.camara.y + ev.punto.y - g.desde.y } };
    }
    return salida(g);
    function terminarCadena(cadena: Extract<Gesto, { k: 'encadenando' }>) {
        const bandas = cadena.bandas.map(b => [...b]);
        if (cadena.actual && !validarNombreCosa(cadena.actual)) bandas.push([cadena.actual]);
        if (!bandas.length) return salida(reposo);
        return cadena.modo === 'subprocesos' ? salida(reposo, [{ op: 'agregarSubprocesos', args: { opd: cadena.opd, bandas, posicion: 'final' } }]) : salida(reposo, [{ op: 'agregarRefinadores', args: { opd: cadena.opd, nombres: bandas.flat() } }]);
    }
}
