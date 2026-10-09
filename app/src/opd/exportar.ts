import type { Modelo, Id, Ref } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import type { Escena, NodoCosa, Punto, Rect } from './escena';
import { escena } from './escena';
import { aTexto, dibujar } from './dibujo';
import type { NodoSvg } from './dibujo';
import { gatesExportacion } from '../nucleo/diagnostico';
import { etiquetaOpd, opdsEnPreorden } from '../nucleo/proyeccion';
import { intersectanSegmentos, intersectaCaja, intersectaCapsula } from './geometria';
import { INRIA_REGULAR_WOFF2, INRIA_ITALICA_WOFF2 } from './fuente';
import { COLORES } from './tokens';
import { anchoTexto } from './metricas';
import { colocarMarcador, colocarTriangulo, triangulo } from './marcadores';
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
const contiene = (a: NodoCosa, b: NodoCosa) => a.contenedor && b.caja.x >= a.caja.x && b.caja.y >= a.caja.y && b.caja.x + b.caja.ancho <= a.caja.x + a.caja.ancho && b.caja.y + b.caja.alto <= a.caja.y + a.caja.alto;
/** Advertencias externas al dibujo: nunca se modifica ni rerutea la escena. */
export function advertenciasEscena(e: Escena, _m?: Modelo): readonly Advertencia[] {
    const ws: Advertencia[] = [];
    const segmentos = [
        ...e.aristas.flatMap(a => a.tramos.map(t => ({ refs: [a.ref],
            ss: t.puntos.slice(1).map((p, i) => [t.puntos[i]!, p] as const),
            estados: new Set(t.estados ?? []), extremos: new Set(t.extremos ?? []), contenedores: new Set(t.contenedores ?? []) }))),
        ...e.simbolos.flatMap(s => s.peine.map((ps, i) => ({
            refs: (s.incidencias?.[i]?.refs ?? s.ramas).map(id => ({ tipo: 'enlace' as const, id })),
            ss: ps.slice(1).map((p, j) => [ps[j]!, p] as const), estados: new Set<Id | undefined>(s.incidencias?.[i]?.estados ?? []),
            extremos: new Set(s.incidencias?.[i]?.extremos ?? []), contenedores: new Set(s.incidencias?.[i]?.contenedores ?? []) })))
    ];
    // Advertencia de área de texto: usa las mismas líneas, métricas y anclas que dibujo.
    // No afirma una colisión de cada glifo ni altera la posición persistida.
    const rotulos = (n: NodoCosa): Rect[] => n.rotulo.lineas.map((linea, i) => {
        const ancho = anchoTexto(linea, 17, n.rotulo.italica);
        return { x: n.rotulo.x - ancho / 2, y: n.rotulo.y + i * 22 - 17, ancho, alto: 22 };
    });
    const poligono = (datos: string, m: readonly number[]): Punto[] => {
        const ns = datos.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
        return Array.from({ length: ns.length / 2 }, (_, i) => ({ x: m[0]! * ns[2*i]! + m[2]! * ns[2*i+1]! + m[4]!, y: m[1]! * ns[2*i]! + m[3]! * ns[2*i+1]! + m[5]! }));
    };
    const dentroPoligono = (p: Punto, ps: readonly Punto[]): boolean => {
        let dentro = false;
        for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
            const a = ps[i]!, b = ps[j]!;
            if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) dentro = !dentro;
        }
        return dentro;
    };
    const tocaTexto = (ps: readonly Punto[], caja: Rect): boolean => ps.some((p, i) => intersectaCaja(p, ps[(i+1)%ps.length]!, caja, 'rectangulo')) ||
        [ {x:caja.x,y:caja.y}, {x:caja.x+caja.ancho,y:caja.y}, {x:caja.x,y:caja.y+caja.alto}, {x:caja.x+caja.ancho,y:caja.y+caja.alto} ].some(p => dentroPoligono(p, ps));
    for (let i = 0; i < segmentos.length; i++) {
        const a = segmentos[i]!;
        for (let j = i + 1; j < segmentos.length; j++) {
            const b = segmentos[j]!;
            if (a.refs.some(r => b.refs.some(t => t.id === r.id)) || [...a.extremos].some(id => b.extremos.has(id)))
                continue;
            if (a.ss.some(s => b.ss.some(t => intersectanSegmentos(s[0], s[1], t[0], t[1]))))
                ws.push({ tipo: 'cruce', refs: [...a.refs, ...b.refs], texto: 'Dos enlaces se cruzan.' });
        }
        for (const n of e.nodos) {
            if (rotulos(n).some(c => a.ss.some(s => intersectaCaja(s[0], s[1], c, 'rectangulo'))))
                ws.push({ tipo: 'atraviesa', refs: [...a.refs, n.ref], texto: 'Un enlace atraviesa el área de un rótulo; su lectura puede quedar ocluida.' });
            for (const estado of n.estados) {
                if (!a.estados.has(estado.ref.id) && a.ss.some(s => intersectaCapsula(s[0], s[1], estado.caja)))
                    ws.push({ tipo: 'atraviesa', refs: [...a.refs, estado.ref], texto: 'Un enlace atraviesa una cápsula que no es el puerto terminal de este tramo.' });
            }
            if (a.contenedores.has(n.ref.id) || a.extremos.has(n.ref.id)) continue;
            if (a.ss.some(s => intersectaCaja(s[0], s[1], n.caja, n.tipo === 'objeto' ? 'rectangulo' : 'elipse')))
                ws.push({ tipo: 'atraviesa', refs: [...a.refs, n.ref], texto: 'Un enlace atraviesa una cosa que no es su extremo.' });
        }
    }
    // La punta literal puede exceder el tramo finito de un enlace corto.
    // Sólo su puerto terminal es contacto intencionado, no el extremo opuesto.
    for (const a of e.aristas) for (const t of a.tramos) {
        for (const [id, p, desde, terminal] of [[t.inicio, t.puntos[0], t.puntos[1], t.extremos?.[0]], [t.fin, t.puntos.at(-1), t.puntos.at(-2), t.extremos?.[1]]] as const) {
            if (id !== 'punta' || !p || !desde) continue;
            const { figura, matriz: m } = colocarMarcador(id, p, desde);
            const ps = poligono(figura.datos, m);
            for (const n of e.nodos) {
                if (rotulos(n).some(c => tocaTexto(ps, c)))
                    ws.push({ tipo: 'atraviesa', refs: [a.ref, n.ref], texto: 'La punta invade el área de un rótulo; la separación persistida es insuficiente.' });
                for (const estado of n.estados) {
                    const puerto = id === t.inicio && p === t.puntos[0] ? t.estados?.[0] : t.estados?.[1];
                    if (estado.ref.id !== puerto && ps.some((p, i) => intersectaCapsula(p, ps[(i+1)%ps.length]!, estado.caja)))
                        ws.push({ tipo: 'atraviesa', refs: [a.ref, estado.ref], texto: 'La punta invade una cápsula distinta de su puerto terminal.' });
                }
                if (t.contenedores?.includes(n.ref.id) || n.ref.id === terminal) continue;
                if (ps.some((p, i) => intersectaCaja(p, ps[(i + 1) % ps.length]!, n.caja, n.tipo === 'objeto' ? 'rectangulo' : 'elipse')))
                    ws.push({ tipo: 'atraviesa', refs: [a.ref, n.ref], texto: 'La punta de un enlace invade una cosa distinta de su puerto terminal; la separación persistida es insuficiente.' });
            }
        }
    }
    // DEC37: una etiqueta o una multiplicidad pisada por una cosa, aunque sea su extremo, o por una punta
    // no se lee. Un contenedor del tramo sólo ocluye con su rótulo.
    const puntas = e.aristas.flatMap(a => a.tramos.flatMap(t => ([[t.inicio, t.puntos[0], t.puntos[1]], [t.fin, t.puntos.at(-1), t.puntos.at(-2)]] as const).flatMap(([id, p, desde]) => {
        if (id !== 'punta' || !p || !desde) return [];
        const { figura, matriz: m } = colocarMarcador(id, p, desde);
        return [{ ref: a.ref, ps: poligono(figura.datos, m) }];
    })));
    // La etiqueta usa el área de texto de cajaEscena; la multiplicidad, cifras y signos sin
    // descendentes, sólo los tres cuartos del cuerpo sobre su línea base.
    const area = (texto: string, en: Punto, mult: boolean, italica: boolean): Rect => {
        const px = mult ? 12 : 11, ancho = anchoTexto(texto, px, italica);
        return mult ? { x: en.x - ancho / 2, y: en.y - px * .75, ancho, alto: px * .75 } : { x: en.x - ancho / 2, y: en.y - px, ancho, alto: px + 4 };
    };
    const textos = [
        ...e.aristas.flatMap(a => a.etiquetas.map(l => ({ refs: [a.ref], mult: l.clave.startsWith('mult'), caja: area(l.texto, l.en, l.clave.startsWith('mult'), l.italica),
            contenedores: new Set(a.tramos.flatMap(t => t.contenedores ?? [])) }))),
        ...e.simbolos.flatMap(s => s.mult.map(l => ({ refs: s.ramas.map(id => ({ tipo: 'enlace' as const, id })), mult: true, caja: area(l.texto, l.en, true, false),
            contenedores: new Set((s.incidencias ?? []).flatMap(i => i.contenedores ?? [])) })))
    ];
    const seCruzan = (a: Rect, b: Rect) => a.x < b.x + b.ancho && a.x + a.ancho > b.x && a.y < b.y + b.alto && a.y + a.alto > b.y;
    for (const l of textos) {
        const quien = l.mult ? 'La multiplicidad' : 'La etiqueta', c = l.caja;
        const esquinas = [{ x: c.x, y: c.y }, { x: c.x + c.ancho, y: c.y }, { x: c.x + c.ancho, y: c.y + c.alto }, { x: c.x, y: c.y + c.alto }];
        for (const n of e.nodos)
            if (l.contenedores.has(n.ref.id) ? rotulos(n).some(r => seCruzan(c, r)) : esquinas.some((p, i) => intersectaCaja(p, esquinas[(i + 1) % 4]!, n.caja, n.tipo === 'objeto' ? 'rectangulo' : 'elipse')))
                ws.push({ tipo: 'atraviesa', refs: [...l.refs, n.ref], texto: `${quien} de un enlace se solapa con una cosa; la separación persistida es insuficiente.` });
        for (const p of puntas)
            if (tocaTexto(p.ps, c))
                ws.push({ tipo: 'atraviesa', refs: l.refs.some(r => r.id === p.ref.id) ? l.refs : [...l.refs, p.ref], texto: `${quien} de un enlace se solapa con una punta; la separación persistida es insuficiente.` });
    }
    for (const s of e.simbolos) {
        const ps = poligono(triangulo(s.relacion).exterior.datos, colocarTriangulo(s.vertice, s.orientacion));
        for (const n of e.nodos) {
            const refs = [...s.ramas.map(id => ({ tipo: 'enlace' as const, id })), n.ref];
            if (rotulos(n).some(c => tocaTexto(ps, c)))
                ws.push({ tipo: 'atraviesa', refs, texto: 'Una figura estructural invade el área de un rótulo; ser extremo del peine no exime esta oclusión.' });
            // El vértice se une al refinable; el cuerpo de otro refinador no es ese puerto.
            if (n.ref.id !== s.refinable && !s.incidencias?.[0]?.contenedores?.includes(n.ref.id) &&
                ps.some((p, i) => intersectaCaja(p, ps[(i+1)%ps.length]!, n.caja, n.tipo === 'objeto' ? 'rectangulo' : 'elipse')))
                ws.push({ tipo: 'atraviesa', refs, texto: 'Una figura estructural invade una cosa distinta del puerto refinable; la separación persistida es insuficiente.' });
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
    return ws.filter((w, i) => ws.findIndex(x => x.tipo === w.tipo && x.texto === w.texto && JSON.stringify(x.refs) === JSON.stringify(w.refs)) === i);
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
    return { ok: true, valor: { svg: svg(m, opd, o.version, true), archivo: `${m.id}-${etiquetaOpd(m, opd)}.svg`, advertencias: advertenciasEscena(escena(m, opd), m) }, trazas: [] };
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
