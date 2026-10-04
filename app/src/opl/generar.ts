import type { Modelo, Id, Enlace, EnlaceNuevo, Cosa } from '../nucleo/tipos';
import { esProcedimental, extremos } from '../nucleo/tipos';
import { indice } from '../nucleo/indice';
import { proyectar } from '../nucleo/proyeccion';
import type { EnlaceVisto } from '../nucleo/proyeccion';
import { noOfrecido, violacionesForma, violacionesAbanico, normalizarEtiquetas } from '../nucleo/matriz';
import type { OpcionesOpl, LineaOpl, TokenOpl } from './linea';
import { textoDeTokens, refsDeTokens } from './linea';
import { cosa, estadoHueco, hueco, datosEnlace, tokensPlantilla, datosContexto, PLANTILLAS } from './plantillas';
import type { Huecos, HechoGenerable } from './plantillas';
const cmp = (a: Cosa, b: Cosa) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }) || a.id.localeCompare(b.id);
function profundidad(m: Modelo, opd: Id): number { let n = 0, o = m.opds[opd]; while (o && o.tipo !== 'raiz') {
    n++;
    o = m.opds[o.padre];
} return n; }
function linea(m: Modelo, opd: Id, h: HechoGenerable, clave: string, hechos: readonly Id[] = [], soloDisplay?: true): LineaOpl {
    const tokens = tokensPlantilla(h.plantilla, h.huecos);
    return { id: `${opd}#${h.plantilla}:${clave}`, plantilla: h.plantilla, texto: textoDeTokens(tokens), tokens, refs: refsDeTokens(tokens), hechos, opd, etiquetaOpd: indice(m).etiqueta.get(opd) ?? opd, profundidad: profundidad(m, opd), ...(soloDisplay ? { soloDisplay } : {}) };
}
function emitirEnlace(m: Modelo, opd: Id, v: EnlaceVisto): LineaOpl[] {
    const normal = normalizarEtiquetas(v.enlace);
    if (!normal.ok)
        return [];
    const e = { ...normal.valor, id: v.enlace.id } as Enlace;
    if (violacionesForma(m, e).length || noOfrecido(m, e))
        return [];
    const directo = datosEnlace(m, e);
    const primera = linea(m, opd, directo, e.id, v.hechos);
    let salida = [primera];
    if (e.tipo === 'etiquetadoBidireccional') {
        const segunda = linea(m, opd, datosEnlace(m, e, true), `${e.id}:inversa`, v.hechos);
        salida = e.estadoOrigen ? [primera, segunda] : [{ ...primera, id: `${opd}#SE3a:${e.id}` }, { ...segunda, id: `${opd}#SE3b:${e.id}` }];
    }
    return salida;
}
export function lineaDeEnlace(m: Modelo, opd: Id, candidato: EnlaceNuevo): LineaOpl | null { if (!m.opds[opd])
    return null; const e = { ...candidato, id: 'previa' } as Enlace; return emitirEnlace(m, opd, { clave: 'previa', enlace: e, hechos: [], abstraido: false })[0] ?? null; }
export function generarBloque(m: Modelo, opd: Id, o?: OpcionesOpl): readonly LineaOpl[] {
    const vista = proyectar(m, opd), idx = indice(m), d = m.opds[opd]!;
    const orden = vista.cosas.map(v => m.cosas[v.cosa]!).sort((a, b) => {
        const av = vista.cosas.find(v => v.cosa === a.id)!, bv = vista.cosas.find(v => v.cosa === b.id)!;
        const rango = (c: Cosa, v: typeof av) => v.rol === 'contenedor' || v.rol === 'refinable' ? 0 : v.rol === 'subproceso' ? 1 : c.tipo === 'proceso' ? 2 : 3;
        return rango(a, av) - rango(b, bv) || (av.rol === 'subproceso' && bv.rol === 'subproceso' ? (av.banda ?? 0) - (bv.banda ?? 0) : 0) || cmp(a, b);
    });
    const contexto: LineaOpl[] = [], cosas: LineaOpl[] = [], enlaces: LineaOpl[] = [];
    const cx = datosContexto(m, opd);
    if (cx)
        contexto.push(linea(m, opd, cx, opd));
    const emit = (id: string, h: Huecos, clave: string, hechos: readonly Id[] = [], display?: true) => linea(m, opd, { plantilla: id, huecos: h }, clave, hechos, display);
    for (const c of orden) {
        const ch = cosa(m, c.id), v = vista.cosas.find(v => v.cosa === c.id)!;
        if (c.esencia === 'fisica')
            cosas.push(emit('D1', { C: ch }, c.id));
        if (c.afiliacion === 'ambiental')
            cosas.push(emit('D3', { C: ch }, c.id));
        if (c.tipo === 'objeto') {
            if (v.estadosVisibles.length)
                cosas.push(emit(v.ocultos ? 'D6' : 'D5', { O: ch, s: v.estadosVisibles.map(s => estadoHueco(m, s)) }, c.id));
            for (const id of v.estadosVisibles) {
                const estado = c.estados.find(s => s.id === id)!;
                const h = { O: ch, s: estadoHueco(m, id) };
                if (estado.inicial && estado.final)
                    cosas.push(emit('D10', h, id));
                else if (estado.inicial || estado.final)
                    cosas.push(emit(estado.inicial ? 'D7' : 'D8', h, id));
                if (c.porDefecto === id)
                    cosas.push(emit('D9', h, id));
                if (c.current === id)
                    cosas.push(emit('D13', h, id));
            }
            if (c.valor !== undefined) {
                const exhibidores = vista.enlaces.filter(v => v.enlace.tipo === 'exhibicion' && v.enlace.refinador === c.id).map(v => m.cosas[(v.enlace as Extract<Enlace, {
                    tipo: 'exhibicion';
                }>).refinable]!).sort(cmp);
                if (exhibidores[0])
                    cosas.push(emit('VAL', { O1: ch, O2: cosa(m, exhibidores[0].id), v: hueco(c.valor) }, c.id));
            }
        }
    }
    const fuerza = ['consumo', 'resultado', 'efecto', 'agente', 'instrumento', 'invocacion', 'excepcionSobretiempo', 'excepcionSubtiempo'];
    const ordenProceso = new Map(orden.map((c, i) => [c.id, i]));
    const porProceso = (e: Enlace) => esProcedimental(e) ? e.proceso : 'origen' in e ? e.origen : '';
    const otro = (e: Enlace) => esProcedimental(e) ? e.objeto : extremos(e).destino;
    const sorted = [...vista.enlaces].sort((a, b) => { const e = a.enlace, f = b.enlace; return (ordenProceso.get(porProceso(e)) ?? Infinity) - (ordenProceso.get(porProceso(f)) ?? Infinity) || fuerza.indexOf(e.tipo) - fuerza.indexOf(f.tipo) || cmp(m.cosas[otro(e)]!, m.cosas[otro(f)]!) || e.id.localeCompare(f.id); });
    const invalidos = new Set<string>(), agrupados = new Set<string>();
    const porHecho = new Map(vista.enlaces.flatMap(v => v.hechos.map(id => [id, v] as const)));
    const fanPorHecho = new Map<string, string>();
    const fanLineas = new Map<string, LineaOpl>();
    for (const fan of Object.values(m.abanicos)) {
        const miembros = fan.enlaces.map(id => porHecho.get(id));
        if (miembros.some(v => !v) || new Set(miembros).size !== miembros.length)
            continue;
        if (violacionesAbanico(m, fan).length || miembros.some(v => !!noOfrecido(m, v!.enlace, fan))) {
            for (const id of fan.enlaces)
                invalidos.add(id);
            continue;
        }
        if (miembros.some(v => { const e = v!.enlace; return (e.tipo === 'consumo' || e.tipo === 'resultado') && e.ruta; }))
            continue;
        const ls = miembros as EnlaceVisto[];
        const first = ls[0]!.enlace;
        if (!esProcedimental(first) && first.tipo !== 'invocacion')
            continue;
        const porP = esProcedimental(first) && ls.every(v => esProcedimental(v.enlace) && v.enlace.proceso === first.proceso);
        const invComunDestino = first.tipo === 'invocacion' && ls.every(v => v.enlace.tipo === 'invocacion' && v.enlace.destino === first.destino);
        const items = [...ls].sort((a, b) => { const endpoint = (e: Enlace) => esProcedimental(e) ? (porP ? e.objeto : e.proceso) : invComunDestino ? extremos(e).origen : extremos(e).destino; return cmp(m.cosas[endpoint(a.enlace)]!, m.cosas[endpoint(b.enlace)]!) || a.enlace.id.localeCompare(b.enlace.id); });
        // La fila local es la única autoridad de su dominio cerrado; los gates N y ruta ya pasaron.
        if (esProcedimental(first) && ls.every(v => !violacionesForma(m, v.enlace).length)) {
            const pidLocal = `FANLOCAL-${fan.operador}`;
            const preparado: HechoGenerable = { plantilla: pidLocal, huecos: { RAMAS: { texto: '', ramas: items.map(v => datosEnlace(m, v.enlace)) } } };
            if (PLANTILLAS.find(p => p.id === pidLocal)?.desde?.(preparado)) {
                const hechos = [...new Set(items.flatMap(v => v.hechos))];
                fanLineas.set(fan.id, linea(m, opd, preparado, `FAN:${fan.id}`, hechos));
                for (const id of fan.enlaces) fanPorHecho.set(id, fan.id);
                continue;
            }
        }
        const h: Record<string, import('./plantillas').ValorHueco> = { operador: hueco(fan.operador) };
        let pid: string;
        if (esProcedimental(first)) {
            if (porP) {
                h.P = cosa(m, first.proceso, first.id);
                h.O = items.map(v => { const e = v.enlace as typeof first; return cosa(m, e.objeto, e.id, e.mult, 'estado' in e ? e.estado : undefined); });
            }
            else {
                h.O = cosa(m, first.objeto, first.id, first.mult, 'estado' in first ? first.estado : undefined);
                h.P = items.map(v => cosa(m, (v.enlace as typeof first).proceso, v.enlace.id));
            }
            const control = 'control' in first ? first.control : undefined;
            if (control) {
                pid = first.tipo === 'consumo' ? 'C18' : control === 'e' ? 'FAN4' : 'CFE';
            }
            else if (first.tipo === 'efecto' && ls.some(v => v.enlace.tipo === 'efecto' && (v.enlace.entrada || v.enlace.salida))) {
                const ef = items.map(v => v.enlace as Extract<Enlace, {
                    tipo: 'efecto';
                }>);
                h.P = cosa(m, first.proceso, first.id);
                h.O = cosa(m, first.objeto, first.id);
                const entrada = ef[0]!.entrada, salida = ef[0]!.salida;
                if (ef.every(e => !e.entrada && e.salida)) {
                    pid = 'FAN5s';
                    h.s = ef.map(e => estadoHueco(m, e.salida!, e.id));
                }
                else if (ef.every(e => e.entrada && !e.salida)) {
                    pid = 'FAN5e';
                    h.s = ef.map(e => estadoHueco(m, e.entrada!, e.id));
                }
                else if (entrada && ef.every(e => e.entrada === entrada && e.salida)) {
                    pid = 'FAN5A';
                    h.e = estadoHueco(m, entrada, first.id);
                    h.s = ef.map(e => estadoHueco(m, e.salida!, e.id));
                }
                else {
                    for (const id of fan.enlaces)
                        invalidos.add(id);
                    continue;
                } // Contrato de salida común pendiente: nunca perder sus entradas.
                (h.s as import('./plantillas').Hueco[]).sort((a, b) => a.texto.localeCompare(b.texto, 'es', { sensitivity: 'base' }) || (a.ref!.id.localeCompare(b.ref!.id)));
            }
            else {
                const convergente = first.tipo === 'resultado' ? !porP : porP;
                pid = `FAN-${first.tipo}-${convergente ? 'convergente' : 'divergente'}-${fan.operador}`;
            }
        }
        else {
            const comunDestino = ls.every(v => v.enlace.tipo === 'invocacion' && v.enlace.destino === first.destino);
            h.P = cosa(m, comunDestino ? first.destino : first.origen, first.id);
            h.Plista = items.map(v => { const e = v.enlace as Extract<Enlace, {
                tipo: 'invocacion';
            }>; return cosa(m, comunDestino ? e.origen : e.destino, e.id); });
            pid = `FAN-invocacion-${comunDestino ? 'convergente' : 'divergente'}-${fan.operador}`;
        }
        if (Array.isArray(h.P)) {
            h.Plista = h.P;
            h.P = esProcedimental(first) ? cosa(m, first.proceso, first.id) : h.P[0]!;
        }
        if (Array.isArray(h.O)) {
            h.Olista = h.O;
            h.O = esProcedimental(first) ? cosa(m, first.objeto, first.id) : h.O[0]!;
        }
        const hechos = pid.startsWith('FAN5') ? (h.s as import('./plantillas').Hueco[]).map(x => x.hecho!) : fan.enlaces.flatMap(id => porHecho.get(id)!.hechos);
        const l = emit(pid, h, `FAN:${fan.id}`, hechos);
        fanLineas.set(fan.id, l);
        for (const id of fan.enlaces)
            fanPorHecho.set(id, fan.id);
    }
    const estructurales = sorted.filter(v => 'refinable' in v.enlace), etiquetados = sorted.filter(v => ['etiquetado', 'etiquetadoBidireccional', 'reciproco'].includes(v.enlace.tipo));
    for (const v of sorted) {
        if ('refinable' in v.enlace || etiquetados.includes(v) || v.hechos.some(id => invalidos.has(id)))
            continue;
        const fan = fanPorHecho.get(v.hechos[0]!);
        if (fan) {
            if (!agrupados.has(fan)) {
                enlaces.push(fanLineas.get(fan)!);
                agrupados.add(fan);
            }
        }
        else
            enlaces.push(...emitirEnlace(m, opd, v));
    }
    if (d.tipo === 'raiz') {
        const generales = new Map<string, EnlaceVisto[]>();
        for (const v of estructurales) {
            const e = v.enlace;
            if (e.tipo === 'generalizacion' && !e.estados) {
                const g = generales.get(e.refinador) ?? [];
                g.push(v);
                generales.set(e.refinador, g);
            }
        }
        const multiples = new Set<EnlaceVisto>();
        for (const [especial, g] of generales)
            if (g.length >= 2) {
                g.sort((a, b) => cmp(m.cosas[(a.enlace as Extract<Enlace, {
                    tipo: 'generalizacion';
                }>).refinable]!, m.cosas[(b.enlace as Extract<Enlace, {
                    tipo: 'generalizacion';
                }>).refinable]!));
                g.forEach(v => multiples.add(v));
                enlaces.push(emit('RH1', { C: cosa(m, especial, g[0]!.enlace.id), articulos: g.map(v => cosa(m, (v.enlace as Extract<Enlace, {
                        tipo: 'generalizacion';
                    }>).refinable, v.enlace.id)) }, especial, g.flatMap(v => v.hechos)));
            }
        const grupos = new Map<string, EnlaceVisto[]>();
        for (const v of estructurales.filter(v => !multiples.has(v))) {
            const e = v.enlace as Extract<Enlace, {
                refinable: string;
            }>;
            const key = JSON.stringify([e.tipo, e.refinable, e.tipo === 'generalizacion' ? e.estados?.general : undefined]);
            const g = grupos.get(key) ?? [];
            g.push(v);
            grupos.set(key, g);
        }
        for (const g of grupos.values()) {
            g.sort((a, b) => cmp(m.cosas[(a.enlace as Extract<Enlace, {
                refinador: string;
            }>).refinador]!, m.cosas[(b.enlace as Extract<Enlace, {
                refinador: string;
            }>).refinador]!));
            const e = g[0]!.enlace as Extract<Enlace, {
                refinable: string;
            }>;
            if (e.tipo === 'generalizacion' && e.estados) {
                enlaces.push(emit('RFE', { O: cosa(m, e.refinable, e.id), s: estadoHueco(m, e.estados.general, e.id), Oe: g.map(v => { const x = v.enlace as Extract<Enlace, {
                        tipo: 'generalizacion';
                    }>; return { ...cosa(m, x.refinador, x.id), estado: estadoHueco(m, x.estados!.especializacion, x.id) }; }) }, `${e.refinable}:${e.estados.general}`, g.flatMap(v => v.hechos)));
                continue;
            }
            let pid = e.tipo === 'agregacion' ? 'RF1' : e.tipo === 'exhibicion' ? 'RF2' : e.tipo === 'generalizacion' ? (g.length === 1 ? 'RF3b' : 'RF3') : g.length === 1 ? 'RF4' : 'RF4b';
            const h: Record<string, import('./plantillas').ValorHueco> = { vertice: cosa(m, e.refinable, e.id), general: cosa(m, e.refinable, e.id), C: g.map(v => { const x = v.enlace as Extract<Enlace, {
                    refinador: string;
                }>; return cosa(m, x.refinador, x.id, 'mult' in x ? x.mult : undefined); }) };
            if (e.tipo === 'exhibicion') {
                const tipo = m.cosas[e.refinable]!.tipo;
                const same = g.filter(v => m.cosas[(v.enlace as Extract<Enlace, {
                    refinador: string;
                }>).refinador]!.tipo === tipo), others = g.filter(v => !same.includes(v));
                if (same.length && others.length) {
                    pid = 'RF2b';
                    h.C = same.map(v => cosa(m, (v.enlace as Extract<Enlace, {
                        refinador: string;
                    }>).refinador, v.enlace.id));
                    h.otro = others.map(v => cosa(m, (v.enlace as Extract<Enlace, {
                        refinador: string;
                    }>).refinador, v.enlace.id));
                    g.splice(0, g.length, ...same, ...others);
                }
            }
            if (vista.incompletas.some(i => i.refinable === e.refinable && i.relacion === e.tipo))
                pid = e.tipo === 'agregacion' ? 'RF1i' : e.tipo === 'exhibicion' ? 'RF2i' : e.tipo === 'generalizacion' ? 'RF3i' : pid;
            if (pid === 'RF3b' || pid === 'RF4')
                h.C = (h.C as import('./plantillas').Hueco[])[0]!;
            enlaces.push(emit(pid, h, `${e.refinable}:${e.tipo}`, g.flatMap(v => v.hechos)));
        }
    }
    else
        for (const v of estructurales)
            enlaces.push(...emitirEnlace(m, opd, v));
    etiquetados.sort((a, b) => cmp(m.cosas[extremos(a.enlace).origen]!, m.cosas[extremos(b.enlace).origen]!) || cmp(m.cosas[extremos(a.enlace).destino]!, m.cosas[extremos(b.enlace).destino]!) || a.enlace.id.localeCompare(b.enlace.id));
    for (const v of etiquetados)
        enlaces.push(...emitirEnlace(m, opd, v));
    const mencionados = new Set([...contexto, ...cosas, ...enlaces].flatMap(l => l.refs.filter(r => r.tipo === 'cosa').map(r => r.id)));
    for (const c of orden)
        if (!mencionados.has(c.id))
            cosas.push(emit('D2', { C: cosa(m, c.id) }, c.id));
    if (o?.esencia === 'siempre')
        for (const c of orden)
            if (c.esencia === 'informacional')
                cosas.push(emit('D2', { C: cosa(m, c.id) }, `${c.id}:display`, [], true));
    const salida = [...contexto, ...cosas, ...enlaces];
    return o?.esencia === 'oculta' ? salida.filter(l => l.plantilla !== 'D1' && l.plantilla !== 'D2') : salida;
}
export function generarModelo(m: Modelo, o?: OpcionesOpl): readonly LineaOpl[] {
    return indice(m).preorden.flatMap(opd => {
        const idx = indice(m), d = m.opds[opd]!, label = idx.etiqueta.get(opd)!;
        const tokens: TokenOpl[] = [{ texto: `## ${label}`, rol: 'texto', ref: { tipo: 'opd', id: opd } }];
        if (d.tipo !== 'raiz') {
            tokens.push({ texto: d.tipo === 'descomposicion' ? ' · descomposición de ' : ' · despliegue de ', rol: 'texto' }, { texto: m.cosas[d.cosa]!.nombre, rol: 'nombre', marca: m.cosas[d.cosa]!.tipo, ref: { tipo: 'cosa', id: d.cosa } }, { texto: ` · en ${idx.etiqueta.get(d.padre)}`, rol: 'texto', ref: { tipo: 'opd', id: d.padre } });
        }
        const cabecera: LineaOpl = { id: `${opd}#cabecera`, plantilla: 'cabecera', texto: textoDeTokens(tokens), tokens, refs: refsDeTokens(tokens), hechos: [], opd, etiquetaOpd: label, profundidad: profundidad(m, opd), soloDisplay: true };
        return [cabecera, ...generarBloque(m, opd, o)];
    });
}
export function textoCanonico(lineas: readonly LineaOpl[]): string { return lineas.filter(l => !l.soloDisplay || l.texto.startsWith('## ')).map(l => l.texto).join('\n'); }
