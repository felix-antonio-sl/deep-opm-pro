import type { Modelo, Id, Ref } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import type { Escena, NodoCosa, Punto } from './escena';
import { escena } from './escena';
import { aTexto, dibujar } from './dibujo';
import type { NodoSvg } from './dibujo';
import { gatesExportacion } from '../nucleo/diagnostico';
import { etiquetaOpd, opdsEnPreorden } from '../nucleo/proyeccion';
import { intersectanSegmentos, intersectaCaja } from './geometria';
import { INRIA_REGULAR_WOFF2, INRIA_ITALICA_WOFF2 } from './fuente';
import { COLORES } from './tokens';
export interface LineaDocumento {
    readonly tokens: readonly {
        readonly texto: string;
        readonly marca?: 'objeto' | 'proceso' | 'estado';
    }[];
}
// LineaOpl la satisface estructuralmente: opd/ no importa opl/
export interface Advertencia {
    readonly tipo: 'cruce' | 'atraviesa' | 'solape';
    readonly refs: readonly Ref[];
    readonly texto: string;
}
const dentro = (n: NodoCosa, p: Punto) => intersectaCaja(p, p, n.caja, n.tipo === 'objeto' ? 'rectangulo' : 'elipse');
const contiene = (a: NodoCosa, b: NodoCosa) => a.contenedor && b.caja.x >= a.caja.x && b.caja.y >= a.caja.y && b.caja.x + b.caja.ancho <= a.caja.x + a.caja.ancho && b.caja.y + b.caja.alto <= a.caja.y + a.caja.alto;
/** Advertencias externas al dibujo: nunca se modifica ni rerutea la escena. */
export function advertenciasEscena(e: Escena): readonly Advertencia[] {
    const ws: Advertencia[] = [];
    const trazados = [
        ...e.aristas.map(a => ({ refs: [a.ref], tramos: a.tramos.map(t => t.puntos) })),
        ...e.simbolos.map(s => ({ refs: s.ramas.map(id => ({ tipo: 'enlace' as const, id })), tramos: s.peine }))
    ];
    const segmentos = trazados.map(a => ({
        refs: a.refs,
        ss: a.tramos.flatMap(t => t.slice(1).map((p, i) => [t[i]!, p] as const)),
        extremos: new Set(e.nodos.filter(n => !n.contenedor && a.tramos.some(t => dentro(n, t[0]!) || dentro(n, t.at(-1)!))).map(n => n.ref.id))
    }));
    for (let i = 0; i < segmentos.length; i++) {
        const a = segmentos[i]!;
        for (let j = i + 1; j < segmentos.length; j++) {
            const b = segmentos[j]!;
            if ([...a.extremos].some(id => b.extremos.has(id)))
                continue;
            if (a.ss.some(s => b.ss.some(t => intersectanSegmentos(s[0], s[1], t[0], t[1]))))
                ws.push({ tipo: 'cruce', refs: [...a.refs, ...b.refs], texto: 'Dos enlaces se cruzan.' });
        }
        for (const n of e.nodos) {
            if (n.contenedor || a.extremos.has(n.ref.id))
                continue;
            if (a.ss.some(s => intersectaCaja(s[0], s[1], n.caja, n.tipo === 'objeto' ? 'rectangulo' : 'elipse')))
                ws.push({ tipo: 'atraviesa', refs: [...a.refs, n.ref], texto: 'Un enlace atraviesa una cosa que no es su extremo.' });
        }
    }
    for (let i = 0; i < e.nodos.length; i++)
        for (let j = i + 1; j < e.nodos.length; j++) {
            const a = e.nodos[i]!, b = e.nodos[j]!;
            if (contiene(a, b) || contiene(b, a))
                continue;
            if (a.caja.x < b.caja.x + b.caja.ancho && a.caja.x + a.caja.ancho > b.caja.x && a.caja.y < b.caja.y + b.caja.alto && a.caja.y + a.caja.alto > b.caja.y)
                ws.push({ tipo: 'solape', refs: [a.ref, b.ref], texto: 'Dos cosas se solapan.' });
        }
    return ws;
}
const escapar = (s: string): string => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const fuente = `@font-face{font-family:'Inria Serif';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${INRIA_REGULAR_WOFF2}) format('woff2')}@font-face{font-family:'Inria Serif';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${INRIA_ITALICA_WOFF2}) format('woff2')}`;
function namespaceSvg(raiz: NodoSvg, ordinal: number): NodoSvg {
    const ids = new Map<string, string>();
    function recoger(n: NodoSvg, enDefs = false): void {
        enDefs ||= n.t === 'defs';
        if (enDefs && typeof n.a.id === 'string') ids.set(n.a.id, `${n.a.id}-${ordinal}`);
        for (const h of n.h ?? []) if (typeof h !== 'string') recoger(h, enDefs);
    }
    recoger(raiz);
    const referencias = new Set(['filter', 'clip-path', 'mask', 'fill', 'stroke', 'marker-start', 'marker-mid', 'marker-end']);
    function renombrar(n: NodoSvg, enDefs = false): NodoSvg {
        enDefs ||= n.t === 'defs';
        const a = Object.fromEntries(Object.entries(n.a).map(([k, v]) => {
            if (typeof v !== 'string') return [k, v];
            if (enDefs && k === 'id') return [k, ids.get(v) ?? v];
            if ((k === 'href' || k === 'xlink:href') && v.startsWith('#')) return [k, ids.has(v.slice(1)) ? `#${ids.get(v.slice(1))}` : v];
            if (referencias.has(k)) return [k, v.replace(/url\(#([^)]+)\)/g, (literal, id: string) => ids.has(id) ? `url(#${ids.get(id)})` : literal)];
            return [k, v];
        }));
        return { ...n, a, ...(n.h ? { h: n.h.map(h => typeof h === 'string' ? h : renombrar(h, enDefs)) } : {}) };
    }
    return renombrar(raiz);
}
function svg(m: Modelo, opd: Id, version: string, incrustar: boolean, ordinal?: number): string {
    const e = escena(m, opd), etiqueta = etiquetaOpd(m, opd), o = m.opds[opd]!, nombre = o.tipo === 'raiz' ? m.nombre : m.cosas[o.cosa]!.nombre;
    const metadata = escapar(JSON.stringify({ perfil: 'canon-diagrama', modelo: m.id, opd, etiqueta, exportParcial: true, fuentes: ['Inria Serif (incrustada)'], version })).replaceAll('&quot;', '"');
    const arbol = dibujar(e, 'canon');
    // Sólo IDs de defs y atributos SVG que realmente los referencian reciben namespace.
    const dibujo = aTexto(ordinal === undefined ? arbol : namespaceSvg(arbol, ordinal));
    const x = e.caja.x - 24, y = e.caja.y - 24, w = e.caja.ancho + 48, h = e.caja.alto + 48;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"><title>${escapar(etiqueta + ' · ' + nombre)}</title><metadata>${metadata}</metadata>${incrustar ? '<style>' + fuente + '</style>' : ''}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${COLORES.paper}"></rect>${dibujo}</svg>`;
}
export function exportarDiagrama(m: Modelo, opd: Id, o: {
    readonly version: string;
}): Respuesta<{
    readonly svg: string;
    readonly archivo: string;
    readonly advertencias: readonly Advertencia[];
}> {
    if (!Object.hasOwn(m.opds, opd))
        return { ok: false, rechazo: { codigo: 'no-encontrado', regla: 'producto', mensaje: 'El OPD no existe.', refs: [{ tipo: 'opd', id: opd }] } };
    const gates = gatesExportacion(m, { opd });
    if (gates[0])
        return { ok: false, rechazo: gates[0] };
    return { ok: true, valor: { svg: svg(m, opd, o.version, true), archivo: `${m.id}-${etiquetaOpd(m, opd)}.svg`, advertencias: advertenciasEscena(escena(m, opd)) }, trazas: [] };
}
export function exportarDocumento(m: Modelo, opl: ReadonlyMap<Id, readonly LineaDocumento[]>, o: {
    readonly version: string;
}): Respuesta<{
    readonly html: string;
    readonly archivo: string;
}> {
    const gates = gatesExportacion(m, 'modelo');
    if (gates[0])
        return { ok: false, rechazo: gates[0] };
    const ids = opdsEnPreorden(m), ordinal = new Map(ids.map((id, i) => [id, i])), hijos = new Map<Id, Id[]>();
    for (const id of ids) {
        const opd = m.opds[id]!;
        if (opd.tipo !== 'raiz') {
            const hs = hijos.get(opd.padre) ?? [];
            hs.push(id);
            hijos.set(opd.padre, hs);
        }
    }
    const rama = (id: Id): string => `<li><a href="#opd-${ordinal.get(id)!}">${escapar(etiquetaOpd(m, id))}</a>${hijos.has(id) ? '<ol>' + hijos.get(id)!.map(rama).join('') + '</ol>' : ''}</li>`;
    const arbol = rama(m.raiz);
    const secciones = ids.map((id, i) => `<section id="opd-${i}"><h2>${escapar(etiquetaOpd(m, id))}</h2>${svg(m, id, o.version, false, i)}<p class="opl">${(opl.get(id) ?? []).map(l => l.tokens.map(t => { const s = escapar(t.texto), tag = t.marca === 'objeto' ? 'strong' : t.marca === 'proceso' ? 'em' : t.marca === 'estado' ? 'code' : undefined; return tag ? `<${tag}>${s}</${tag}>` : s; }).join('')).join('\n')}</p></section>`).join('');
    return { ok: true, valor: { html: `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="perfil" content="canon-documento"><title>${escapar(m.nombre)}</title><style>${fuente}body{font-family:'Inria Serif';background:${COLORES.paper};color:#000}svg{max-width:100%;height:auto}.opl{white-space:pre-wrap}code{font-family:inherit;font-style:italic}</style></head><body><h1>${escapar(m.nombre)}</h1><nav aria-label="Árbol de OPDs"><ol>${arbol}</ol></nav>${secciones}</body></html>`, archivo: `${m.id}.html` }, trazas: [] };
}
