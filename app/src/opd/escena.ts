import type { Modelo, Id, Ref, TipoCosa, ModoDespliegue, Enlace } from '../nucleo/tipos';
import { extremos, esProcedimental } from '../nucleo/tipos';
import { proyectar } from '../nucleo/proyeccion';
import { indice } from '../nucleo/indice';
import { anchoTexto, envolver } from './metricas';
import { recortarEnlace, rayo, autoinvocacion, peine, abanico } from './geometria';
import type { Contorno } from './geometria';
import { colocarMarcador, colocarTriangulo } from './marcadores';
export interface Punto {
    readonly x: number;
    readonly y: number;
}
export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly ancho: number;
    readonly alto: number;
}
export type Marcador = 'punta' | 'piruletaNegra' | 'piruletaBlanca' | 'abierta' | 'arpon' | 'arponInverso';
export interface Escena {
    readonly opd: Id;
    readonly caja: Rect; // unión de todo lo dibujado (sombras +8, arcos, rótulos)
    readonly nodos: readonly NodoCosa[];
    readonly simbolos: readonly Simbolo[];
    readonly aristas: readonly Arista[];
    readonly arcos: readonly Arco[];
}
export interface NodoCosa {
    readonly ref: Ref;
    readonly tipo: TipoCosa;
    readonly caja: Rect;
    readonly contenedor: boolean;
    readonly grueso: boolean; // grueso ⇔ la cosa tiene descomposición o despliegue (T-202)
    readonly ambiental: boolean;
    readonly fisica: boolean; // dash 8 4 / sombra (T-200, T-201)
    readonly rotulo: {
        readonly lineas: readonly string[];
        readonly x: number;
        readonly y: number;
        readonly italica: boolean;
    };
    readonly estados: readonly NodoEstado[];
    readonly chipOcultos?: {
        readonly n: number;
        readonly caja: Rect;
    }; // ⋯N (T-208)
    readonly duracion?: string; // «[min] {1, 3, 5}» (T-220)
    readonly rotuloInstancia?: string; // «Nombre : Clase» (T-222)
}
export interface NodoEstado {
    readonly ref: Ref;
    readonly caja: Rect;
    readonly nombre: string;
    readonly inicial: boolean;
    readonly final: boolean;
    readonly porDefecto: boolean;
    readonly current: boolean;
}
export interface Simbolo {
    readonly clave: string; // 'simbolo:<refinable>:<relacion>' (data-ref)
    readonly refinable: Id;
    readonly relacion: ModoDespliegue;
    readonly vertice: Punto;
    readonly orientacion: 'abajo' | 'arriba' | 'derecha' | 'izquierda';
    readonly incompleta: boolean;
    readonly ramas: readonly Id[]; // enlaces
    readonly peine: readonly (readonly Punto[])[]; // tramo común + bajadas (ortogonales)
    readonly mult: readonly {
        readonly texto: string;
        readonly en: Punto;
    }[];
}
export interface Tramo {
    readonly puntos: readonly Punto[];
    readonly inicio?: Marcador;
    readonly fin?: Marcador;
}
export interface Arista {
    readonly ref: Ref;
    readonly hechos: readonly Id[];
    readonly tramos: readonly Tramo[]; // TS3: 2 tramos (entrada→P, P→salida)
    readonly rayo: boolean; // invocación
    readonly marcas: readonly {
        readonly texto: 'e' | 'c' | '/' | '//';
        readonly en: Punto;
        readonly angulo: number;
    }[];
    readonly etiquetas: readonly {
        readonly texto: string;
        readonly en: Punto;
        readonly italica: boolean;
        readonly clave: 'etiqueta' | 'inversa' | 'ruta' | 'mult-origen' | 'mult-destino';
    }[];
    readonly capa: 4 | 20; // 20 = anclada a estado
}
export interface Arco {
    readonly abanico: Id;
    readonly centro: Punto;
    readonly radio: number;
    readonly desde: number;
    readonly hasta: number;
    readonly doble: boolean;
}
const memo = new WeakMap<Modelo, Map<Id, Escena>>();
const centro = (r: Rect): Punto => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const forma = (n: NodoCosa): Contorno['forma'] => n.tipo === 'proceso' ? 'elipse' : 'rectangulo';
const medio = (a: Punto, b: Punto): Punto => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const cerca = (a: Punto, b: Punto, n: number): Punto => {
    const l = Math.hypot(b.x - a.x, b.y - a.y);
    return l ? { x: b.x + (a.x - b.x) * n / l, y: b.y + (a.y - b.y) * n / l } : b;
};
const multiplicidad = (objeto: Punto, otro: Punto): Punto => {
    const l = Math.hypot(otro.x - objeto.x, otro.y - objeto.y) || 1;
    const dx = (otro.x - objeto.x) / l, dy = (otro.y - objeto.y) / l;
    return { x: objeto.x + 14 * dx + 10 * dy, y: objeto.y + 14 * dy - 10 * dx };
};
/** Proyección y medidas deterministas. Las cajas persistidas son mínimos; no se mutan ni se autorutean. */
export function escena(m: Modelo, opd: Id): Escena {
    const previa = memo.get(m)?.get(opd);
    if (previa)
        return previa;
    const vista = proyectar(m, opd), o = m.opds[opd]!, idx = indice(m);
    const nodos: NodoCosa[] = vista.cosas.map(v => {
        const c = m.cosas[v.cosa]!, a = o.apariciones[c.id]!, italica = c.tipo === 'proceso';
        const clasificacion = Object.values(m.enlaces).find(e => e.tipo === 'clasificacion' && e.refinador === c.id);
        const rotuloInstancia = clasificacion && 'refinable' in clasificacion ? `${c.nombre} : ${m.cosas[clasificacion.refinable]!.nombre}` : undefined;
        const lineas = envolver(rotuloInstancia ?? c.nombre, Math.max(111, a.ancho - 24), 17, italica);
        const duracion = c.tipo === 'proceso' && c.duracion ? `[${c.duracion.unidad ?? m.unidadTiempo}] {${[c.duracion.min, c.duracion.esperada, c.duracion.max].map(n => n === undefined ? '–' : String(n)).join(', ')}}` : undefined;
        const propios = c.tipo === 'objeto' ? c.estados.filter(s => v.estadosVisibles.includes(s.id)) : [];
        const anchos = propios.map(s => anchoTexto(s.nombre, 13, true) + 16 + (s.inicial ? 6 : 0));
        // Valor puntual: expresión del objeto atributo, sin entidad/estado sintético.
        const valor = c.tipo === 'objeto' ? c.valor : undefined;
        const altoNombre = lineas.length * 22, altoExtra = duracion ? 20 : 0;
        const ancho = Math.max(a.ancho, (italica ? 1.4 : 1) * Math.max(0, ...lineas.map(l => anchoTexto(l, 17, italica))) + 24, duracion ? anchoTexto(duracion, 11, false) + 32 : 0, propios.length ? anchos.reduce((s, w) => s + w, 0) + (propios.length - 1) * 8 + 16 : 0, valor ? anchoTexto(valor, 13, true) + 24 : 0);
        const alto = Math.max(a.alto, altoNombre + altoExtra + 24 + (propios.length ? 44 : 0) + (v.ocultos ? 28 : 0) + (valor ? 30 : 0));
        const caja = { x: a.x, y: a.y, ancho, alto }, contenedor = v.rol === 'contenedor';
        let x = a.x + (ancho - (anchos.reduce((s, w) => s + w, 0) + Math.max(0, propios.length - 1) * 8)) / 2;
        const estados: NodoEstado[] = propios.map((s, i) => {
            const n: NodoEstado = {
                ref: { tipo: 'estado', id: s.id },
                caja: { x, y: a.y + alto - 42 - (valor ? 34 : 0) - (v.ocultos ? 28 : 0), ancho: anchos[i]!, alto: 26 },
                nombre: s.nombre.normalize('NFC'), inicial: !!s.inicial, final: !!s.final,
                porDefecto: c.tipo === 'objeto' && c.porDefecto === s.id,
                current: c.tipo === 'objeto' && c.current === s.id
            };
            x += anchos[i]! + 8;
            return n;
        });
        if (valor) {
            const w = Math.max(52, anchoTexto(valor, 13, true) + 24);
            estados.push({ ref: { tipo: 'cosa', id: c.id }, caja: { x: a.x + (ancho - w) / 2, y: a.y + alto - 36 - (v.ocultos ? 28 : 0), ancho: w, alto: 26 }, nombre: valor.normalize('NFC'), inicial: false, final: false, porDefecto: false, current: false });
        }
        return { ref: { tipo: 'cosa', id: c.id }, tipo: c.tipo, caja, contenedor, grueso: idx.refinamientosDe.has(c.id), ambiental: c.afiliacion === 'ambiental', fisica: c.esencia === 'fisica', rotulo: { lineas, x: a.x + ancho / 2, y: contenedor ? a.y + 24 : a.y + (alto - altoExtra - (propios.length ? 44 : 0) - (v.ocultos ? 28 : 0) - (valor ? 30 : 0) - altoNombre) / 2 + 17, italica }, estados, ...(v.ocultos ? { chipOcultos: { n: v.ocultos, caja: { x: a.x + ancho - 54, y: a.y + alto - 26, ancho: 42, alto: 16 } } } : {}), ...(duracion ? { duracion } : {}), ...(rotuloInstancia ? { rotuloInstancia } : {}) };
    });
    // Un contenedor debe cubrir la expansión calculada de sus internos, sin moverlos.
    const internos = new Set(vista.cosas.filter(v => v.rol === 'subproceso' || v.rol === 'interno').map(v => v.cosa));
    const ci = nodos.findIndex(n => n.contenedor);
    if (ci >= 0) {
        const n = nodos[ci]!, ins = nodos.filter(x => internos.has(x.ref.id));
        nodos[ci] = { ...n, caja: { ...n.caja, ancho: Math.max(n.caja.ancho, ...ins.map(x => x.caja.x + x.caja.ancho - n.caja.x + 24)), alto: Math.max(n.caja.alto, ...ins.map(x => x.caja.y + x.caja.alto - n.caja.y + 24)) } };
    }
    const porId = new Map(nodos.map(n => [n.ref.id, n]));
    function contorno(id: Id, estado?: Id): Contorno { const n = porId.get(id)!; const s = estado ? n.estados.find(s => s.ref.id === estado) : undefined; return s ? { caja: s.caja, forma: 'capsula' } : { caja: n.caja, forma: forma(n) }; }
    const simbolos: Simbolo[] = [], aristas: Arista[] = [], arcos: Arco[] = [];
    const grupos = new Map<string, typeof vista.enlaces[number][]>();
    function anotaciones(e: typeof vista.enlaces[number]['enlace'], tramos: readonly Tramo[]): Pick<Arista, 'marcas' | 'etiquetas'> {
        const ex = extremos(e);
        const marcas: Arista['marcas'][number][] = [], etiquetas: Arista['etiquetas'][number][] = [];
        const t = tramos[0]!, a = t.puntos[0]!, b = t.puntos.at(-1)!, angulo = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        if ('control' in e && e.control) {
            const receptor = e.tipo === 'efecto' && e.entrada ? b : esProcedimental(e) && ex.destino === e.proceso ? b : a;
            const desde = receptor === b ? a : b;
            marcas.push({ texto: e.control, en: cerca(desde, receptor, 28), angulo: 0 });
        }
        if (e.tipo === 'excepcionSobretiempo' || e.tipo === 'excepcionSubtiempo')
            marcas.push({ texto: e.tipo === 'excepcionSobretiempo' ? '/' : '//', en: cerca(a, b, 22), angulo });
        const mid = medio(a, b), normal = { x: -(b.y - a.y) / (Math.hypot(b.x - a.x, b.y - a.y) || 1), y: (b.x - a.x) / (Math.hypot(b.x - a.x, b.y - a.y) || 1) };
        const apartada = (texto: string, signo: number, fraccion = .5): Punto => {
            const separacion = Math.max(12, anchoTexto(texto, 11, true) / 2 * Math.abs(normal.x) + 11 * Math.abs(normal.y) + 4);
            return { x: a.x + (b.x - a.x) * fraccion + normal.x * separacion * signo, y: a.y + (b.y - a.y) * fraccion + normal.y * separacion * signo };
        };
        const etiqueta = (texto: string, clave: Arista['etiquetas'][number]['clave'], en: Punto, italica = false) => etiquetas.push({ texto: texto.normalize('NFC'), clave, en, italica });
        if ('etiqueta' in e && e.etiqueta)
            etiqueta(e.etiqueta, 'etiqueta', apartada(e.etiqueta, -1, e.tipo === 'etiquetadoBidireccional' ? 1 / 3 : .5), true);
        if (e.tipo === 'etiquetadoBidireccional')
            etiqueta(e.inversa, 'inversa', apartada(e.inversa, 1, 2 / 3), true);
        if ('ruta' in e && e.ruta) {
            // Izquierda de O→P; un resultado conserva ese sentido aunque se dibuje P→O.
            const signo = esProcedimental(e) && e.tipo === 'resultado' ? -1 : 1;
            etiqueta(e.ruta, 'ruta', { x: mid.x + normal.x * -10 * signo, y: mid.y + normal.y * -10 * signo });
        }
        if ('mult' in e && e.mult)
            etiqueta(e.mult, 'mult-origen', multiplicidad(ex.origen === ('objeto' in e ? e.objeto : undefined) ? a : b, ex.origen === ('objeto' in e ? e.objeto : undefined) ? b : a));
        if ('multOrigen' in e && e.multOrigen)
            etiqueta(e.multOrigen, 'mult-origen', multiplicidad(a, b));
        if ('multDestino' in e && e.multDestino)
            etiqueta(e.multDestino, 'mult-destino', multiplicidad(b, a));
        return { marcas, etiquetas };
    }
    for (const v of vista.enlaces) {
        const e = v.enlace;
        if ('refinable' in e) {
            const key = JSON.stringify([e.refinable, e.tipo, e.tipo === 'generalizacion' ? e.estados?.general : undefined]);
            const g = grupos.get(key) ?? [];
            g.push(v);
            grupos.set(key, g);
            continue;
        }
        const ex = extremos(e);
        let estadoA: Id | undefined, estadoB: Id | undefined;
        if (esProcedimental(e)) {
            if (e.tipo === 'efecto') {
                estadoA = e.entrada;
                estadoB = e.salida;
            }
            else if (e.tipo === 'resultado')
                estadoB = e.estado;
            else
                estadoA = e.estado;
        }
        else if (e.tipo === 'etiquetado') {
            estadoA = e.estadoOrigen;
            estadoB = e.estadoDestino;
        }
        else if (e.tipo === 'etiquetadoBidireccional')
            estadoA = e.estadoOrigen;
        else if (e.tipo === 'reciproco') {
            estadoA = e.estados?.origen;
            estadoB = e.estados?.destino;
        }
        const tramos: Tramo[] = [];
        const segmento = (a: Contorno, b: Contorno, inicio?: Marcador, fin?: Marcador): Tramo => { const puntos = recortarEnlace(a.caja, a.forma, b.caja, b.forma); return { puntos, ...(inicio ? { inicio } : {}), ...(fin ? { fin } : {}) }; };
        if (e.tipo === 'efecto' && (e.entrada || e.salida)) {
            if (e.entrada)
                tramos.push(segmento(contorno(e.objeto, e.entrada), contorno(e.proceso), undefined, 'punta'));
            if (e.salida)
                tramos.push(segmento(contorno(e.proceso), contorno(e.objeto, e.salida), undefined, 'punta'));
        }
        else {
            const a = contorno(ex.origen, estadoA), b = contorno(ex.destino, estadoB);
            const fin: Marcador | undefined = e.tipo === 'agente' ? 'piruletaNegra' : e.tipo === 'instrumento' ? 'piruletaBlanca' : e.tipo === 'etiquetado' ? 'abierta' : e.tipo === 'etiquetadoBidireccional' || e.tipo === 'reciproco' ? 'arpon' : e.tipo.startsWith('excepcion') ? undefined : 'punta';
            const inicio: Marcador | undefined = e.tipo === 'efecto' ? 'punta' : e.tipo === 'etiquetadoBidireccional' || e.tipo === 'reciproco' ? 'arponInverso' : undefined;
            const t = segmento(a, b, inicio, fin);
            tramos.push(e.tipo === 'invocacion' ? { ...t, puntos: ex.origen === ex.destino ? autoinvocacion(a.caja).puntos : rayo(t.puntos[0]!, t.puntos[1]!) } : t);
        }
        const { marcas, etiquetas } = anotaciones(e, tramos);
        aristas.push({ ref: { tipo: 'enlace', id: e.id }, hechos: v.hechos, tramos, rayo: e.tipo === 'invocacion', marcas, etiquetas, capa: estadoA || estadoB ? 20 : 4 });
    }
    for (const g of grupos.values()) {
        const e = g[0]!.enlace;
        if (!('refinable' in e))
            continue;
        const general = e.tipo === 'generalizacion' ? e.estados?.general : undefined;
        const refinadores = g.map(v => {
            const r = v.enlace;
            if (!('refinador' in r))
                throw new Error('grupo estructural');
            const s = r.tipo === 'generalizacion' ? r.estados?.especializacion : undefined;
            return { ...contorno(r.refinador, s), id: r.id };
        });
        const incompleta = vista.incompletas.some(i => i.refinable === e.refinable && i.relacion === e.tipo);
        const geo = peine(contorno(e.refinable, general), refinadores, incompleta);
        if (!geo)
            continue;
        simbolos.push({ clave: `simbolo:${e.refinable}:${e.tipo}${general ? ':' + general : ''}`, refinable: e.refinable, relacion: e.tipo, vertice: geo.vertice, orientacion: geo.orientacion, incompleta, ramas: g.map(v => v.enlace.id), peine: [geo.tronco, geo.tallo, geo.barra, ...geo.ramas.map(r => r.puntos), ...(geo.incompleta ? [geo.incompleta] : [])], mult: g.flatMap(v => v.enlace.tipo === 'agregacion' && v.enlace.mult ? [{ texto: v.enlace.mult, en: multiplicidad(geo.ramas.find(r => r.id === v.enlace.id)!.puntos[1], geo.ramas.find(r => r.id === v.enlace.id)!.puntos[0]) }] : []) });
    }
    for (const f of vista.abanicos) {
        const ramas = f.ramas.map(id => aristas.find(a => a.ref.id === id)).filter((a): a is Arista => !!a);
        if (ramas.length < 2)
            continue;
        const enlacesRamas = f.ramas.map(id => vista.enlaces.find(v => v.enlace.id === id)!.enlace);
        const estadosComunes = enlacesRamas.map(e => esProcedimental(e) && e.objeto === f.comun ? (e.tipo === 'efecto' ? e.entrada ?? e.salida : e.estado) : undefined);
        const uniforme = estadosComunes.every(s => s === estadosComunes[0]);
        const estadoComun = uniforme ? estadosComunes[0] : undefined;
        // El sector sigue las alternativas visibles por estado, no sólo el centro del objeto.
        const entradasVariables = new Set(enlacesRamas.map(e => e.tipo === 'efecto' ? e.entrada : undefined)).size > 1;
        const comun = contorno(f.comun, estadoComun), otros = enlacesRamas.map(e => {
            if (esProcedimental(e) && e.proceso === f.comun) {
                const estado = e.tipo === 'efecto' ? (entradasVariables ? e.entrada : e.salida ?? e.entrada) : e.estado;
                return centro(contorno(e.objeto, estado).caja);
            }
            const ex = extremos(e);
            return centro(contorno(ex.origen === f.comun ? ex.destino : ex.origen).caja);
        });
        const geo = abanico(comun, otros, f.operador);
        for (const a of ramas) {
            if (!uniforme)
                continue;
            const i = aristas.indexOf(a), e = vista.enlaces.find(v => v.enlace.id === a.ref.id)!.enlace, ex = extremos(e);
            const tramos = a.tramos.map((t, tramo) => {
                const saleComun = e.tipo === 'efecto' && (e.entrada || e.salida)
                    ? ((!!e.entrada && tramo === 0) ? e.objeto === f.comun : e.proceso === f.comun)
                    : ex.origen === f.comun;
                return { ...t, puntos: t.puntos.map((p, j) => j === (saleComun ? 0 : t.puntos.length - 1) ? geo.acople : p) };
            });
            aristas[i] = { ...a, tramos, ...anotaciones(e, tramos) };
        }
        arcos.push(...geo.arcos.map(a => ({ abanico: f.abanico, centro: a.centro, radio: a.radio, desde: a.desde, hasta: a.hasta, doble: f.operador === 'OR' })));
    }
    const e: Escena = { opd, nodos, simbolos, aristas, arcos, caja: cajaEscena(nodos, simbolos, aristas, arcos) };
    const porOpd = memo.get(m) ?? new Map<Id, Escena>();
    porOpd.set(opd, e);
    memo.set(m, porOpd);
    return e;
}
function cajaEscena(nodos: readonly NodoCosa[], simbolos: readonly Simbolo[], aristas: readonly Arista[], arcos: readonly Arco[]): Rect {
    const puntos: Punto[] = [];
    const rect = (r: Rect, pad = 0) => puntos.push({ x: r.x - pad, y: r.y - pad }, { x: r.x + r.ancho + pad, y: r.y + r.alto + pad });
    const texto = (s: string, en: Punto, px: number, italica: boolean) => { const ancho = anchoTexto(s, px, italica); rect({ x: en.x - ancho / 2, y: en.y - px, ancho, alto: px + 4 }); };
    for (const n of nodos) {
        rect(n.caja, n.grueso ? 2 : .75);
        if (n.fisica)
            rect({ ...n.caja, ancho: n.caja.ancho + 8, alto: n.caja.alto + 8 });
        for (const s of n.estados) {
            rect(s.caja, 2);
            if (s.current)
                rect({ x: s.caja.x + s.caja.ancho - 4, y: s.caja.y - 12, ancho: 8, alto: 12 }, 1);
            if (s.porDefecto)
                rect({ x: s.caja.x - 12, y: s.caja.y - 12, ancho: 12, alto: 12 }, 1);
        }
        n.rotulo.lineas.forEach((l, i) => texto(l, { x: n.rotulo.x, y: n.rotulo.y + i * 22 }, 17, n.rotulo.italica));
        if (n.duracion)
            texto(n.duracion, { x: n.rotulo.x, y: n.rotulo.y + n.rotulo.lineas.length * 22 }, 11, false);
    }
    const transformar = (m: readonly number[], ps: readonly Punto[]) => ps.forEach(p => puntos.push({ x: m[0]! * p.x + m[2]! * p.y + m[4]!, y: m[1]! * p.x + m[3]! * p.y + m[5]! }));
    for (const s of simbolos) {
        s.peine.forEach(t => puntos.push(...t));
        transformar(colocarTriangulo(s.vertice, s.orientacion), [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 30 }, { x: 0, y: 30 }]);
        s.mult.forEach(l => texto(l.texto, l.en, 11, false));
    }
    for (const a of aristas) {
        for (const t of a.tramos) {
            puntos.push(...t.puntos);
            for (const [id, p, desde] of [[t.inicio, t.puntos[0], t.puntos[1]], [t.fin, t.puntos.at(-1), t.puntos.at(-2)]] as const)
                if (id && p && desde) {
                    const m = colocarMarcador(id, p, desde).matriz;
                    transformar(m, [{ x: 0, y: -10 }, { x: 23, y: -10 }, { x: 23, y: 10 }, { x: 0, y: 10 }]);
                }
        }
        a.etiquetas.forEach(l => texto(l.texto, l.en, 11, l.italica));
        a.marcas.forEach(l => rect({ x: l.en.x - 24, y: l.en.y - 24, ancho: 48, alto: 48 }));
    }
    for (const a of arcos) {
        const angulos = [a.desde, a.hasta, ...[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI, 5 * Math.PI / 2, 3 * Math.PI, 7 * Math.PI / 2, 4 * Math.PI].filter(x => x >= a.desde && x <= a.hasta)];
        angulos.forEach(x => puntos.push({ x: a.centro.x + Math.cos(x) * a.radio, y: a.centro.y + Math.sin(x) * a.radio }));
    }
    if (!puntos.length)
        return { x: 0, y: 0, ancho: 0, alto: 0 };
    const x = Math.min(...puntos.map(p => p.x)) - 1, y = Math.min(...puntos.map(p => p.y)) - 1;
    return { x, y, ancho: Math.max(...puntos.map(p => p.x)) + 1 - x, alto: Math.max(...puntos.map(p => p.y)) + 1 - y };
}
