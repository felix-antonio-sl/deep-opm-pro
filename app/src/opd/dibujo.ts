import type { Escena, NodoCosa, NodoEstado, Punto, Tramo, Arista, Simbolo, Arco } from './escena';
import { COLORES, TRAZOS, DASH_AMBIENTAL, SOMBRA_FISICA } from './tokens';
import { colocarMarcador, colocarTriangulo, triangulo, MARCADORES } from './marcadores';
import type { FiguraLiteral } from './marcadores';
export interface NodoSvg {
    readonly t: string;
    readonly a: Readonly<Record<string, string | number>>;
    readonly h?: readonly (NodoSvg | string)[];
    readonly k?: string;
}
const nodo = (t: string, a: NodoSvg['a'], h?: NodoSvg['h']): NodoSvg => ({ t, a, ...(h ? { h } : {}) });
const camino = (p: readonly Punto[]): string => p.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
const texto = (s: string, p: Punto, px: number, italica = false): NodoSvg => nodo('text', {
    x: p.x, y: p.y, fill: '#000', 'font-family': 'Inria Serif', 'font-size': px,
    'font-style': italica ? 'italic' : 'normal', 'font-weight': 400,
    'font-kerning': 'none', 'font-variant-ligatures': 'none', 'letter-spacing': 0, 'word-spacing': 0,
    style: 'font-kerning:none;font-variant-ligatures:none;letter-spacing:0;word-spacing:0',
    'text-anchor': 'middle'
}, [s]);
const figura = (f: FiguraLiteral, transform?: string, trazo: number = 1): NodoSvg => nodo(f.tipo === 'path' ? 'path' : f.tipo === 'polilinea' ? 'polyline' : 'polygon', { [f.tipo === 'path' ? 'd' : 'points']: f.datos, fill: f.relleno === 'papel' ? COLORES.paper : f.relleno === 'tinta' ? COLORES.ink : 'none', stroke: COLORES.ink, 'stroke-width': trazo, ...(transform ? { transform } : {}) });
const matriz = (m: readonly number[]) => `matrix(${m.join(' ')})`;
/** Un solo árbol semántico; el modo edición agrega referencias y áreas transparentes. */
export function dibujar(e: Escena, modo: 'canon' | 'edicion'): NodoSvg {
    const envolver = (ref: string, h: readonly NodoSvg[]): NodoSvg => ({ t: 'g', a: modo === 'edicion' ? { 'data-ref': ref } : {}, h, ...(modo === 'edicion' ? { k: ref } : {}) });
    function estado(s: NodoEstado): NodoSvg {
        const r = s.caja, h: NodoSvg[] = [nodo('rect', { x: r.x, y: r.y, width: r.ancho, height: r.alto, rx: 8, fill: s.final ? COLORES.estadoFinalFill : COLORES.estadoFill, stroke: COLORES.opmEstado, 'stroke-width': s.inicial ? TRAZOS.inicial : TRAZOS.estado })];
        if (s.final)
            h.push(nodo('rect', { x: r.x + 3, y: r.y + 3, width: r.ancho - 6, height: r.alto - 6, rx: 5, fill: 'none', stroke: COLORES.opmEstado, 'stroke-width': 1 }));
        if (s.porDefecto)
            h.push(nodo('path', { d: `M ${r.x - 12} ${r.y - 12} L ${r.x} ${r.y} M ${r.x - 8} ${r.y} L ${r.x} ${r.y} L ${r.x} ${r.y - 8}`, fill: 'none', stroke: COLORES.ink, 'stroke-width': 1.2 }));
        if (s.current) {
            const x = r.x + r.ancho;
            h.push(nodo('circle', { cx: x, cy: r.y - 8, r: 3.5, fill: COLORES.ink, stroke: COLORES.ink, 'stroke-width': 1 }));
            h.push(nodo('path', { 'aria-label': 'pin-current', d: `M ${x} ${r.y} L ${x} ${r.y - 4.5}`, fill: 'none', stroke: COLORES.ink, 'stroke-width': 1 }));
        }
        h.push(texto(s.nombre, { x: r.x + r.ancho / 2, y: r.y + r.alto / 2 + 4 }, 13, true));
        return envolver(`${s.ref.tipo}:${s.ref.id}`, h);
    }
    function cosa(n: NodoCosa): NodoSvg {
        const r = n.caja, a = { fill: COLORES.paper, stroke: n.tipo === 'objeto' ? COLORES.opmObjeto : COLORES.opmProceso, 'stroke-width': n.grueso ? TRAZOS.refinada : TRAZOS.cosa, ...(n.ambiental ? { 'stroke-dasharray': DASH_AMBIENTAL } : {}), ...(n.fisica ? { filter: 'url(#sombra-fisica)' } : {}) };
        const forma = n.tipo === 'objeto' ? nodo('rect', { x: r.x, y: r.y, width: r.ancho, height: r.alto, ...a }) : nodo('ellipse', { cx: r.x + r.ancho / 2, cy: r.y + r.alto / 2, rx: r.ancho / 2, ry: r.alto / 2, ...a });
        const h: NodoSvg[] = [forma, ...n.rotulo.lineas.map((l, i) => texto(l, { x: n.rotulo.x, y: n.rotulo.y + i * 22 }, 17, n.rotulo.italica)), ...n.estados.map(estado)];
        if (n.duracion)
            h.push(texto(n.duracion, { x: n.rotulo.x, y: n.rotulo.y + n.rotulo.lineas.length * 22 }, 11));
        if (n.chipOcultos) {
            const c = n.chipOcultos;
            h.push(nodo('rect', { x: c.caja.x, y: c.caja.y, width: c.caja.ancho, height: c.caja.alto, rx: c.caja.alto / 2, fill: COLORES.estadoFill, stroke: COLORES.opmEstado, 'stroke-width': TRAZOS.estado }), texto(`⋯${c.n}`, { x: c.caja.x + c.caja.ancho / 2, y: c.caja.y + c.caja.alto / 2 + 4 }, 13, true));
        }
        return envolver(`cosa:${n.ref.id}`, h);
    }
    function tramo(t: Tramo): NodoSvg[] {
        const h = [nodo('path', { d: camino(t.puntos), fill: 'none', stroke: COLORES.ink, 'stroke-width': TRAZOS.enlace })];
        for (const [id, p, desde] of [[t.inicio, t.puntos[0], t.puntos[1]], [t.fin, t.puntos.at(-1), t.puntos.at(-2)]] as const)
            if (id && p && desde) {
                const c = colocarMarcador(id, p, desde);
                h.push(figura(c.figura, matriz(c.matriz)));
            }
        return h;
    }
    function arista(a: Arista): NodoSvg {
        const h = a.tramos.flatMap(tramo);
        if (modo === 'edicion')
            h.unshift(...a.tramos.map(t => nodo('path', { d: camino(t.puntos), fill: 'none', stroke: 'transparent', 'stroke-width': 15, 'pointer-events': 'stroke' })));
        for (const m of a.marcas) {
            if (m.texto === 'e' || m.texto === 'c') {
                h.push(nodo('circle', { cx: m.en.x, cy: m.en.y, r: 9, fill: COLORES.paper, stroke: COLORES.ink, 'stroke-width': 1 }));
                h.push(texto(m.texto, { x: m.en.x, y: m.en.y + 4 }, 12));
            } else {
                h.push(figura(m.texto === '/' ? MARCADORES.sobretiempo : MARCADORES.subtiempo, `translate(${m.en.x} ${m.en.y}) rotate(${m.angulo}) translate(-13 0)`));
            }
        }
        h.push(...a.etiquetas.map(l => {
            const t = texto(l.texto, l.en, 11, l.italica);
            // Halo de pintura: el ancla contractual, la tipografía y el recorrido no cambian.
            return { ...t, a: { ...t.a, stroke: COLORES.paper, 'stroke-width': 3, 'stroke-linejoin': 'round', 'paint-order': 'stroke fill' } };
        }));
        return envolver(`enlace:${a.ref.id}`, h);
    }
    function simbolo(s: Simbolo): NodoSvg {
        const topologia = triangulo(s.relacion), trans = matriz(colocarTriangulo(s.vertice, s.orientacion)), h: NodoSvg[] = s.peine.map(p => nodo('path', { d: camino(p), fill: 'none', stroke: COLORES.ink, 'stroke-width': TRAZOS.estructural }));
        h.push(figura(topologia.exterior, trans, TRAZOS.estructural));
        if (topologia.interior) {
            const i = topologia.interior;
            h.push(i.tipo === 'circulo' ? nodo('circle', { cx: i.centro.x, cy: i.centro.y, r: i.radio, fill: COLORES.ink, transform: trans }) : figura(i, trans, TRAZOS.estructural));
        }
        h.push(...s.mult.map(l => { const t = texto(l.texto, l.en, 11); return { ...t, a: { ...t.a, stroke: COLORES.paper, 'stroke-width': 3, 'stroke-linejoin': 'round', 'paint-order': 'stroke fill' } }; }));
        return envolver(s.clave, h);
    }
    function arco(a: Arco): NodoSvg { const x = a.centro.x, y = a.centro.y, r = a.radio, d = `M ${x + r * Math.cos(a.desde)} ${y + r * Math.sin(a.desde)} A ${r} ${r} 0 ${a.hasta - a.desde > Math.PI ? 1 : 0} 1 ${x + r * Math.cos(a.hasta)} ${y + r * Math.sin(a.hasta)}`; return nodo('path', { d, fill: 'none', stroke: COLORES.ink, 'stroke-width': TRAZOS.arco, 'stroke-dasharray': '4 1' }); }
    const abanicos = new Map<string, Arco[]>();
    for (const a of e.arcos) {
        const grupo = abanicos.get(a.abanico) ?? [];
        grupo.push(a);
        abanicos.set(a.abanico, grupo);
    }
    const capa = (z: number, h: readonly NodoSvg[]) => nodo('g', { 'data-capa': z }, h);
    const defs = nodo('defs', {}, [nodo('filter', { id: 'sombra-fisica', x: '-20%', y: '-20%', width: '160%', height: '160%', 'color-interpolation-filters': 'sRGB' }, [nodo('feDropShadow', { dx: SOMBRA_FISICA.dx, dy: SOMBRA_FISICA.dy, stdDeviation: SOMBRA_FISICA.stdDeviation, 'flood-color': SOMBRA_FISICA.flood })])]);
    return nodo('g', {}, [defs, capa(0, e.nodos.filter(n => n.contenedor).map(cosa)), capa(4, e.aristas.filter(a => a.capa === 4).map(arista)), capa(5, [...abanicos].map(([id, as]) => envolver(`abanico:${id}`, as.map(arco)))), capa(10, e.nodos.filter(n => !n.contenedor).map(cosa)), capa(12, e.simbolos.map(simbolo)), capa(20, e.aristas.filter(a => a.capa === 20).map(arista))]);
}
const xml = (s: string): string => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export function aTexto(n: NodoSvg): string {
    const atributos = Object.entries(n.a).map(([k, v]) => ` ${k}="${xml(String(v))}"`).join('');
    return `<${n.t}${atributos}>${(n.h ?? []).map(h => typeof h === 'string' ? xml(h) : aTexto(h)).join('')}</${n.t}>`;
}
