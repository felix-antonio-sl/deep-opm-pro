import type { Modelo, Id, Ref, TipoCosa, ModoDespliegue, Enlace } from '../nucleo/tipos';
import { extremos, esProcedimental } from '../nucleo/tipos';
import { proyectar } from '../nucleo/proyeccion';
import { indice } from '../nucleo/indice';
import { anchoTexto, envolver } from './metricas';
import { recortarEnlace, rayo, autoinvocacion, peine, abanico, agruparRecorridos, agruparConVertices, expandirCaja, intersectaCaja, intersectaCapsula, arcoLibre, recortar, crucesCirculo, radioUniforme, arcoLibreElipse, tintaMarcador, arcoLibrePoligono } from './geometria';
import type { Contorno, ObstaculoArco } from './geometria';
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
    // Medir primero los procesos con la misma construcción que consume el
    // dibujo: el packing de O debe consultar sus cajas, no mínimos persistidos.
    const medidos = new Map<Id, NodoCosa>();
    const medirNodo = (v: typeof vista.cosas[number]): NodoCosa => {
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
        let reservaEstados = propios.length ? 44 : 0;
        const ancho = Math.max(a.ancho, (italica ? 1.4 : 1) * Math.max(0, ...lineas.map(l => anchoTexto(l, 17, italica))) + 24, duracion ? Math.SQRT2 * Math.max(anchoTexto(duracion, 11, false), ...lineas.map(l => anchoTexto(l, 17, italica))) + 16 : 0, propios.length ? anchos.reduce((s, w) => s + w, 0) + (propios.length - 1) * 8 + 16 : 0, valor ? anchoTexto(valor, 13, true) + 24 : 0);
        let alto = Math.max(a.alto, duracion ? (altoNombre + altoExtra) * Math.SQRT2 + 16 : 0, altoNombre + altoExtra + 24 + (propios.length ? 44 : 0) + (v.ocultos ? 28 : 0) + (valor ? 30 : 0));
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
        // Sólo packing privado de un terminal uniforme que quedaría tapado.
        // Acople, radios, sector, capas y recorridos rectos permanecen intactos.
        const uniformes = vista.abanicos.filter(f => f.comun === c.id).flatMap(f => {
            const ramas = f.ramas.map(id => vista.enlaces.find(e => e.enlace.id === id)!.enlace);
            const primero = ramas[0];
            if (!primero || !esProcedimental(primero) || primero.tipo === 'efecto' || !primero.estado || !ramas.every(e => esProcedimental(e) && e.tipo !== 'efecto' && e.objeto === c.id && e.estado === primero.estado)) return [];
            const s = estados.find(s => s.ref.id === primero.estado);
            if (!s) return [];
            const otros = ramas.map(e => centro(medidos.get((e as typeof primero).proceso)!.caja));
            const geo = abanico({ caja: s.caja, forma: 'capsula' }, otros, f.operador);
            return [{ otros, estado: primero.estado, operador: f.operador, visible: geo.arcos.every(arco => arcoLibre(arco, [expandirCaja({ ...caja, ancho: caja.ancho + (c.esencia === 'fisica' ? 8 : 0), alto: caja.alto + (c.esencia === 'fisica' ? 8 : 0) }, 1)])) }];
        });
        if (uniformes.some(f => !f.visible) && estados.length > 1) {
            const top = estados.map(s => s.current || s.porDefecto ? 12 : 0);
            const alturaFilas = estados.reduce((sum, s, i) => sum + s.caja.alto + top[i]!, 0) + (estados.length - 1) * 8;
            reservaEstados = alturaFilas + 16;
            alto = Math.max(alto, altoNombre + altoExtra + 24 + alturaFilas + 16 + (v.ocultos ? 28 : 0) + (valor ? 34 : 0));
            caja.alto = alto;
            let y = a.y + alto - 16 - (v.ocultos ? 28 : 0) - (valor ? 34 : 0) - alturaFilas;
            const procesos = uniformes.flatMap(f => f.otros), derecha = procesos.reduce((sum, p) => sum + p.x / procesos.length, 0) >= a.x + ancho / 2;
            estados.forEach((s, i) => {
                y += top[i]!;
                estados[i] = { ...s, caja: { ...s.caja, x: derecha ? a.x + ancho - 8 - s.caja.ancho : a.x + 8, y } };
                y += s.caja.alto + 8;
            });
            // Cada fila conserva su terminal uniforme. Derivar sólo la mínima
            // traslación horizontal que deja TODO el sector fuera del cuerpo;
            // no sustituir el acople ni sus radios por una marca diferente.
            estados.forEach((s, i) => {
                const fans = uniformes.filter(f => f.estado === s.ref.id);
                if (!fans.length) return;
                const opaco = expandirCaja({ ...caja, ancho: caja.ancho + (c.esencia === 'fisica' ? 8 : 0), alto: caja.alto + (c.esencia === 'fisica' ? 8 : 0) }, 1);
                const visible = (x: number): boolean => fans.every(f => abanico({ caja: { ...s.caja, x }, forma: 'capsula' }, f.otros, f.operador).arcos.every(arco => arcoLibre(arco, [opaco])));
                if (visible(s.caja.x)) return;
                const limite = derecha ? a.x + ancho - s.caja.ancho : a.x;
                if (!visible(limite)) return;
                let oculto = s.caja.x, libre = limite;
                for (let j = 0; j < 40; j++) {
                    const medio = (oculto + libre) / 2;
                    if (visible(medio)) libre = medio; else oculto = medio;
                }
                estados[i] = { ...s, caja: { ...s.caja, x: libre } };
            });
        }
        if (valor) {
            const w = Math.max(52, anchoTexto(valor, 13, true) + 24);
            estados.push({ ref: { tipo: 'cosa', id: c.id }, caja: { x: a.x + (ancho - w) / 2, y: a.y + alto - 36 - (v.ocultos ? 28 : 0), ancho: w, alto: 26 }, nombre: valor.normalize('NFC'), inicial: false, final: false, porDefecto: false, current: false });
        }
        return { ref: { tipo: 'cosa', id: c.id }, tipo: c.tipo, caja, contenedor, grueso: idx.refinamientosDe.has(c.id), ambiental: c.afiliacion === 'ambiental', fisica: c.esencia === 'fisica', rotulo: { lineas, x: a.x + ancho / 2, y: contenedor ? a.y + 24 : a.y + (alto - altoExtra - reservaEstados - (v.ocultos ? 28 : 0) - (valor ? 30 : 0) - altoNombre) / 2 + 17, italica }, estados, ...(v.ocultos ? { chipOcultos: { n: v.ocultos, caja: { x: a.x + ancho - 54, y: a.y + alto - 26, ancho: 42, alto: 16 } } } : {}), ...(duracion ? { duracion } : {}), ...(rotuloInstancia ? { rotuloInstancia } : {}) };
    };
    for (const v of vista.cosas.filter(v => m.cosas[v.cosa]!.tipo === 'proceso')) medidos.set(v.cosa, medirNodo(v));
    for (const v of vista.cosas.filter(v => m.cosas[v.cosa]!.tipo !== 'proceso')) medidos.set(v.cosa, medirNodo(v));
    // Orden semántico/de capas original, independiente del orden de medición.
    const nodos: NodoCosa[] = vista.cosas.map(v => medidos.get(v.cosa)!);
    // Un contenedor debe cubrir la expansión calculada de sus internos, sin moverlos.
    const internos = new Set(vista.cosas.filter(v => v.rol === 'subproceso' || v.rol === 'interno').map(v => v.cosa));
    const ci = nodos.findIndex(n => n.contenedor);
    if (ci >= 0) {
        const n = nodos[ci]!, ins = nodos.filter(x => internos.has(x.ref.id));
        nodos[ci] = { ...n, caja: { ...n.caja, ancho: Math.max(n.caja.ancho, ...ins.map(x => x.caja.x + x.caja.ancho - n.caja.x + 24)), alto: Math.max(n.caja.alto, ...ins.map(x => x.caja.y + x.caja.alto - n.caja.y + 24)) } };
    }
    // Si P es contenedor, su caja medida anterior no era todavía definitiva.
    // Volver a derivar sólo O consultando esa misma caja expandida y conservar
    // el orden Vista. La expansión posterior incorpora cualquier crecimiento O.
    if (ci >= 0 && nodos[ci]!.tipo === 'proceso') {
        medidos.set(nodos[ci]!.ref.id, nodos[ci]!);
        for (const v of vista.cosas.filter(v => m.cosas[v.cosa]!.tipo !== 'proceso')) {
            const i = nodos.findIndex(n => n.ref.id === v.cosa); nodos[i] = medirNodo(v);
        }
        const n = nodos[ci]!, ins = nodos.filter(x => internos.has(x.ref.id));
        nodos[ci] = { ...n, caja: { ...n.caja, ancho: Math.max(n.caja.ancho, ...ins.map(x => x.caja.x+x.caja.ancho-n.caja.x+24)), alto: Math.max(n.caja.alto,...ins.map(x=>x.caja.y+x.caja.alto-n.caja.y+24)) } };
    }
    const uniformesX = vista.abanicos.flatMap(f => {
        const enlaces = f.ramas.map(id => vista.enlaces.find(v => v.enlace.id === id)!.enlace);
        const e = enlaces[0];
        if ((f.operador !== 'XOR' && f.operador !== 'OR') || !e || !esProcedimental(e) || e.tipo === 'efecto' || !e.estado || e.objeto !== f.comun
            || !enlaces.every(r => esProcedimental(r) && ['consumo','resultado','agente','instrumento'].includes(r.tipo) && r.objeto === f.comun && r.tipo !== 'efecto' && r.estado === e.estado && !('control' in r && r.control))
            || new Set(enlaces.map(r => 'proceso' in r ? r.proceso : undefined)).size !== enlaces.length) return [];
        return [{ f, enlaces: enlaces as readonly (Enlace & { readonly objeto: Id; readonly proceso: Id; readonly estado: Id })[], estado: e.estado }];
    });
    const seleccionUniforme = new Map<Id, { readonly arcos: ReturnType<typeof abanico>['arcos']; readonly puntos: ReadonlyMap<Id, readonly Punto[]> }>();
    for (const objetoId of new Set(uniformesX.map(f => f.f.comun))) {
        const ni = nodos.findIndex(n => n.ref.id === objetoId), original = nodos[ni]!, fans = uniformesX.filter(f => f.f.comun === objetoId);
        const ordenar = (ps: readonly Punto[]) => [...ps].sort((a,b)=>a.x-b.x || a.y-b.y);
        const media = (ps: readonly Punto[]) => { const p=ordenar(ps); return {x:p.reduce((v,c)=>v+c.x/p.length,0),y:p.reduce((v,c)=>v+c.y/p.length,0)}; };
        const finales = (objeto: NodoCosa): readonly NodoCosa[] => {
            const ns = nodos.map(n => n.ref.id===objetoId?objeto:n);
            if(ci<0 || ns[ci]!.tipo!=='proceso') return ns;
            const n=ns[ci]!, ins=ns.filter(x=>internos.has(x.ref.id));
            ns[ci]={...n,caja:{...n.caja,ancho:Math.max(n.caja.ancho,...ins.map(x=>x.caja.x+x.caja.ancho-n.caja.x+24)),alto:Math.max(n.caja.alto,...ins.map(x=>x.caja.y+x.caja.alto-n.caja.y+24))}}; return ns;
        };
        const rotulos = (ns: readonly NodoCosa[]) => ns.flatMap(n=>[...n.rotulo.lineas.map((l,i)=>({x:n.rotulo.x-anchoTexto(l,17,n.rotulo.italica)/2,y:n.rotulo.y+i*22-19,ancho:anchoTexto(l,17,n.rotulo.italica),alto:23})),
            ...(n.duracion?[{x:n.rotulo.x-anchoTexto(n.duracion,11,false)/2,y:n.rotulo.y+n.rotulo.lineas.length*22-13,ancho:anchoTexto(n.duracion,11,false),alto:17}]:[])]);
        const marcadorLibre = (tipo: Marcador, p: Punto, adj: Punto, cajas: readonly Rect[], caps: readonly NodoEstado[]) => {
            const M=colocarMarcador(tipo,p,adj).matriz, en=(x:number,y:number)=>({x:M[0]*x+M[2]*y+M[4],y:M[1]*x+M[3]*y+M[5]});
            if(tipo==='punta') { const ps=[en(0,0),en(23,8),en(12,0),en(23,-8)]; return !ps.some((a,i)=>caps.some(s=>intersectaCapsula(a,ps[(i+1)%4]!,s.caja,s.inicial?2:1.1)) || cajas.some(r=>intersectaCaja(a,ps[(i+1)%4]!,expandirCaja(r,.5),'rectangulo'))); }
            const C=en(12,0); return !caps.some(s=>intersectaCapsula(en(0,0),en(7,0),s.caja,s.inicial?2:1.1) || intersectaCapsula(C,C,s.caja,s.inicial?7:6.1))
                && !cajas.some(r=>intersectaCaja(en(0,0),en(7,0),expandirCaja(r,.5),'rectangulo') || intersectaCaja(C,C,expandirCaja(r,5.5),'rectangulo'));
        };
        const evaluar = (objeto: NodoCosa, adaptar: boolean, previo: boolean): typeof seleccionUniforme | null => {
            const ns=finales(objeto), por=new Map(ns.map(n=>[n.ref.id,n])), textos=rotulos(ns), elegidos: typeof seleccionUniforme = new Map();
            const elipses=ns.filter(n=>!n.contenedor && n.tipo==='proceso' && !n.fisica).map(n=>{const pad=n.grueso?2.75:1.5,factor=1+pad/Math.min(n.caja.ancho/2,n.caja.alto/2),cx=centro(n.caja);return{x:cx.x-n.caja.ancho*factor/2,y:cx.y-n.caja.alto*factor/2,ancho:n.caja.ancho*factor,alto:n.caja.alto*factor};});
            const cuerpos=ns.filter(n=>!n.contenedor && (n.tipo!=='proceso' || n.fisica)).map(n=>expandirCaja({...n.caja,ancho:n.caja.ancho+(n.fisica?8:0),alto:n.caja.alto+(n.fisica?8:0)},n.grueso?2.75:1.5));
            const adornos=ns.flatMap(n=>[...(n.chipOcultos?[expandirCaja(n.chipOcultos.caja,.75)]:[]),...n.estados.flatMap(s=>[...(s.current?[expandirCaja({x:s.caja.x+s.caja.ancho-4,y:s.caja.y-12,ancho:8,alto:12},1.25)]:[]),...(s.porDefecto?[expandirCaja({x:s.caja.x-12,y:s.caja.y-12,ancho:12,alto:12},1.25)]:[])])]);
            const opacos=[...cuerpos,...textos.map(r=>expandirCaja(r,.75)),...adornos,...ns.flatMap(n=>n.estados.map(s=>expandirCaja(s.caja,s.inicial?2.25:1.35)))];
            for(const fan of fans) {
                const estado=objeto.estados.find(s=>s.ref.id===fan.estado)!;
                const otros=fan.enlaces.map(e=>centro(por.get(e.proceso)!.caja)), geo=abanico({caja:estado.caja,forma:'capsula'},otros,fan.f.operador);
                const puntos=new Map<Id,readonly Punto[]>(), marcadores: ObstaculoArco[]=[];
                for(const e of fan.enlaces) {
                    const P=por.get(e.proceso)!, Q=recortar(P.caja,previo?centro(estado.caja):geo.acople,'elipse');
                    const ps=e.tipo==='resultado'?[Q,geo.acople]:[geo.acople,Q];
                    const caps=ns.flatMap(n=>n.estados).filter(s=>s.ref.id!==fan.estado);
                    const cuerposAjenos=ns.filter(n=>!n.contenedor && n.ref.id!==objetoId && n.ref.id!==e.proceso).map(n=>expandirCaja(n.caja,n.grueso?2.5:1.25));
                    if(caps.some(s=>intersectaCapsula(ps[0]!,ps[1]!,s.caja,s.inicial?2:.75)) || [...textos,...cuerposAjenos,...adornos].some(r=>intersectaCaja(ps[0]!,ps[1]!,expandirCaja(r,.5),'rectangulo'))) return null;
                    const tipo: Marcador=e.tipo==='agente'?'piruletaNegra':e.tipo==='instrumento'?'piruletaBlanca':'punta';
                    if(!marcadorLibre(tipo,ps[1]!,ps[0]!,[...textos,...cuerposAjenos,...adornos],caps)) return null;
                    marcadores.push(...tintaMarcador(tipo as 'punta'|'piruletaNegra'|'piruletaBlanca',colocarMarcador(tipo,ps[1]!,ps[0]!).matriz,1.25));
                    puntos.set(e.id,ps);
                }
                const arcos=adaptar?radioUniforme(geo.acople,fan.enlaces.map(e=>puntos.get(e.id)![e.tipo==='resultado'?0:1]!),fan.f.operador as 'XOR'|'OR',opacos,elipses,marcadores):geo.arcos;
                if(!arcos || !arcos.every(a=>arcoLibre(a,opacos) && marcadores.every(mark=>mark.tipo==='poligono'?arcoLibrePoligono(a,mark.puntos,0):arcoLibreElipse(a,{x:mark.centro.x-mark.radio,y:mark.centro.y-mark.radio,ancho:2*mark.radio,alto:2*mark.radio})) && elipses.every(e=>arcoLibreElipse(a,e)) && [...puntos.values()].every(ps=>crucesCirculo(a.centro,a.radio,ps[0]!,ps[1]!).some(p=>{let angle=Math.atan2(p.y-a.centro.y,p.x-a.centro.x);while(angle<a.desde-1e-9)angle+=Math.PI*2;return angle<=a.hasta+1e-9;})))) return null;
                elegidos.set(fan.f.abanico,{arcos,puntos});
            }
            return elegidos;
        };
        // K0 conserva todos sus bytes cuando está completo. La familia siguiente
        // enumera ambas orientaciones espaciales, k estados/fila (1..n), tres alturas y ocho anclajes
        // geométricos. Orden k, altura, anclaje; ninguna clave o nombre desempata.
        const k0=evaluar(original,false,true);
        if(k0) { for(const [id,g] of k0) seleccionUniforme.set(id,g); continue; }
        const candidatos: NodoCosa[]=[];
        const centros=fans.flatMap(f=>f.enlaces.map(e=>centro(nodos.find(n=>n.ref.id===e.proceso)!.caja))), objetivo=media(centros);
        for(const invertir of [false,true]) for(let k=1;k<=original.estados.length;k++) {
            const ordenEspacial=invertir?[...original.estados].reverse():original.estados;
            const filas: NodoEstado[][]=[]; for(let i=0;i<ordenEspacial.length;i+=k) filas.push(ordenEspacial.slice(i,i+k));
            const alturas=filas.map(f=>26+(f.some(s=>s.current || s.porDefecto)?12:0)), H=alturas.reduce((a,b)=>a+b,0)+8*(filas.length-1);
            const reserva=(original.chipOcultos?28:0)+(m.cosas[objetoId]!.tipo==='objeto' && 'valor' in m.cosas[objetoId]! && m.cosas[objetoId]!.valor?34:0);
            const alto=Math.max(original.caja.alto,2*(H+16+reserva)), abajo=original.caja.y+alto-16-reserva-H, arriba=original.caja.y+alto/2;
            const ys=[abajo,arriba,Math.max(arriba,Math.min(abajo,objetivo.y-13))];
            for(const inicio of [...new Set(ys)]) for(let anclaje=0;anclaje<8;anclaje++) for(const ladoRestante of [1,0]) {
                let y=inicio; const estados: NodoEstado[]=[];
                for(const [i,fila] of filas.entries()) {
                    const w=fila.reduce((v,s)=>v+s.caja.ancho,0)+8*(fila.length-1);
                    const procesos=fans.filter(f=>fila.some(s=>s.ref.id===f.estado)).flatMap(f=>f.enlaces.map(e=>centro(nodos.find(n=>n.ref.id===e.proceso)!.caja)));
                    const target=procesos.length?media(procesos):objetivo;
                    const xs=[original.caja.x+8,original.caja.x+(original.caja.ancho-w)/2,original.caja.x+original.caja.ancho-w-8,target.x-w/2,target.x,target.x-w,original.caja.x,original.caja.x+original.caja.ancho-w];
                    let x=procesos.length?xs[anclaje]!:anclaje>=3?(ladoRestante?original.caja.x+original.caja.ancho-w-8:original.caja.x+8):xs[anclaje]!;
                    x=Math.max(original.caja.x,Math.min(original.caja.x+original.caja.ancho-w,x));
                    y+=alturas[i]!-26;
                    for(const s of fila) {estados.push({...s,caja:{...s.caja,x,y}});x+=s.caja.ancho+8;}
                    y+=34;
                }
                candidatos.push({...original,caja:{...original.caja,alto},estados:original.estados.map(s=>estados.find(e=>e.ref.id===s.ref.id)!)});
            }
        }
        let elegido: {readonly objeto: NodoCosa; readonly geos: typeof seleccionUniforme} | undefined;
        for(const adaptar of [false,true]) {
            for(const objeto of [original,...candidatos]) { const geos=evaluar(objeto,adaptar,false); if(geos) {elegido={objeto,geos};break;} }
            if(elegido) break;
        }
        if(!elegido) throw new RangeError('Agrupamiento uniforme pendiente');
        const ns=finales(elegido.objeto); ns.forEach((n,i)=>{nodos[i]=n;});
        for(const [id,g] of elegido.geos) seleccionUniforme.set(id,g);
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
            let en = { x: mid.x + normal.x * -10 * signo, y: mid.y + normal.y * -10 * signo };
            if (t.puntos.length > 2) {
                const candidatos = t.puntos.slice(1).map((b, i) => {
                    const a = t.puntos[i]!, len = Math.hypot(b.x - a.x, b.y - a.y);
                    return { len, en: { x: (a.x + b.x) / 2 + 10 * signo * (b.y - a.y) / len, y: (a.y + b.y) / 2 - 10 * signo * (b.x - a.x) / len } };
                }).filter(c => c.len > 0).sort((a, b) => b.len - a.len);
                const ancho = anchoTexto(e.ruta, 11, false);
                const libre = candidatos.find(c => !nodos.some(n => intersectaCaja(c.en, c.en, expandirCaja(n.caja, ancho / 2 + 2), 'rectangulo')));
                if (libre) en = libre.en;
                else throw new RangeError(`Ruta sin posición visible: ${e.id}`);
            }
            etiqueta(e.ruta, 'ruta', en);
        }
        if ('mult' in e && e.mult)
            etiqueta(e.mult, 'mult-origen', ex.origen === ('objeto' in e ? e.objeto : undefined) ? multiplicidad(a, t.puntos[1]!) : multiplicidad(b, t.puntos.at(-2)!));
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
        const propiosHeterogeneos = !uniforme && (f.operador === 'XOR' || f.operador === 'OR')
            && enlacesRamas.every(e => esProcedimental(e) && e.objeto === f.comun && ['consumo', 'resultado', 'agente', 'instrumento'].includes(e.tipo) && !('control' in e && e.control))
            && new Set(enlacesRamas.map(e => 'proceso' in e ? e.proceso : undefined)).size === enlacesRamas.length;
        if (propiosHeterogeneos) {
            const cajas = nodos.map(n => expandirCaja({ ...n.caja, ancho: n.caja.ancho + (n.fisica ? 8 : 0), alto: n.caja.alto + (n.fisica ? 8 : 0) }, 9));
            const etiquetas = aristas.flatMap(a => a.etiquetas.map(l => ({ x: l.en.x - anchoTexto(l.texto, 11, l.italica) / 2 - 2, y: l.en.y - 13, ancho: anchoTexto(l.texto, 11, l.italica) + 4, alto: 17 })));
            const cajasMarcadores = aristas.flatMap(a => a.tramos.flatMap(t => [[t.inicio, t.puntos[0], t.puntos[1]], [t.fin, t.puntos.at(-1), t.puntos.at(-2)]] as const).flatMap(([id, p, adj]) => {
                if (!id || !p || !adj) return [];
                const m = colocarMarcador(id, p, adj).matriz;
                const puntos = [[0, -10], [23, -10], [23, 10], [0, 10]].map(([x, y]) => ({ x: m[0] * x! + m[2] * y! + m[4], y: m[1] * x! + m[3] * y! + m[5] }));
                const x = Math.min(...puntos.map(p => p.x)), y = Math.min(...puntos.map(p => p.y));
                return [expandirCaja({ x, y, ancho: Math.max(...puntos.map(p => p.x)) - x, alto: Math.max(...puntos.map(p => p.y)) - y }, 2)];
            }));
            const rotulos = nodos.flatMap(n => n.rotulo.lineas.map((l, i) => ({ x: n.rotulo.x - anchoTexto(l, 17, n.rotulo.italica) / 2 - 2, y: n.rotulo.y + i * 22 - 19, ancho: anchoTexto(l, 17, n.rotulo.italica) + 4, alto: 23 })));
            const ramasGeometricas = enlacesRamas.map(e => {
                if (!esProcedimental(e) || e.tipo === 'efecto') throw Error('Dominio gráfico C/R/A/I');
                const estado = e.estado;
                const bloques = (proceso: boolean) => [
                    ...nodos.filter(n => n.ref.id !== (proceso ? e.proceso : e.objeto) && !(proceso && estado && n.ref.id === e.objeto)).map(n => expandirCaja({ ...n.caja, ancho: n.caja.ancho + (n.fisica ? 8 : 0), alto: n.caja.alto + (n.fisica ? 8 : 0) }, 2)),
                    ...nodos.flatMap(n => n.estados.filter(s => s.ref.id !== estado).map(s => expandirCaja(s.caja, 2))),
                    ...(!proceso && !estado && porId.get(e.objeto)!.fisica ? (() => {
                        const c = porId.get(e.objeto)!.caja;
                        return [{ x: c.x + c.ancho + .001, y: c.y - 2, ancho: 9, alto: c.alto + 11 }, { x: c.x - 2, y: c.y + c.alto + .001, ancho: c.ancho + 11, alto: 9 }];
                    })() : []),
                    ...rotulos.filter(r => !intersectaCaja(centro(contorno(proceso ? e.proceso : e.objeto, proceso ? undefined : estado).caja), centro(contorno(proceso ? e.proceso : e.objeto, proceso ? undefined : estado).caja), r, 'rectangulo'))
                ];
                return { id: e.id, terminal: contorno(e.objeto, estado), proceso: contorno(e.proceso), obstaculosTerminal: bloques(false), obstaculosProceso: bloques(true) };
            });
            const trazables = ramas.every(a => {
                const r = ramasGeometricas.find(r => r.id === a.ref.id)!;
                const ps = a.tramos[0]!.puntos;
                // Las zonas que no pertenecen a los dos terminales son opacas.
                const iguales = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.ancho === b.ancho && a.alto === b.alto;
                const todasCapsulas = nodos.flatMap(n => n.estados);
                const opacos = r.obstaculosTerminal.filter(box => !todasCapsulas.some(s => iguales(box, expandirCaja(s.caja, 2))) && !intersectaCaja(centro(r.proceso.caja), centro(r.proceso.caja), box, 'rectangulo'));
                const propio = enlacesRamas.find(e => e.id === a.ref.id)!;
                const ajenas = todasCapsulas.filter(s => !('estado' in propio) || s.ref.id !== propio.estado);
                return ps.slice(1).every((b, i) => !opacos.some(box => intersectaCaja(ps[i]!, b, box, 'rectangulo')) && !ajenas.some(s => intersectaCapsula(ps[i]!, b, s.caja, s.inicial ? 1.5 : .75)));
            });
            let agrupados = trazables ? agruparRecorridos(porId.get(f.comun)!.caja, ramas.map(a => a.tramos[0]!.puntos), f.operador as 'XOR' | 'OR', [...cajas, ...etiquetas, ...cajasMarcadores]) : null;
            if (!agrupados) {
                const derivados = agruparConVertices(porId.get(f.comun)!.caja, ramasGeometricas, f.operador as 'XOR' | 'OR', [...cajas, ...etiquetas, ...cajasMarcadores]);
                if (derivados) {
                    agrupados = derivados.arcos;
                    for (const a of ramas) {
                        const e = enlacesRamas.find(e => e.id === a.ref.id)!;
                        const puntos = derivados.caminos.get(a.ref.id)!;
                        const tramos = [{ ...a.tramos[0]!, puntos: e.tipo === 'resultado' ? [...puntos].reverse() : puntos }];
                        aristas[aristas.indexOf(a)] = { ...a, tramos, ...anotaciones(e, tramos) };
                    }
                }
            }
            if (!agrupados) throw new RangeError(`Agrupamiento pendiente: ${f.abanico}`);
            arcos.push(...agrupados.map(a => ({ abanico: f.abanico, centro: a.centro, radio: a.radio, desde: a.desde, hasta: a.hasta, doble: f.operador === 'OR' })));
            continue;
        }
        const seleccionado = seleccionUniforme.get(f.abanico);
        if (seleccionado) {
            for (const a of ramas) {
                const e=enlacesRamas.find(e=>e.id===a.ref.id)!, i=aristas.indexOf(a);
                const tramos=[{...a.tramos[0]!,puntos:seleccionado.puntos.get(a.ref.id)!}];
                aristas[i]={...a,tramos,...anotaciones(e,tramos)};
            }
            arcos.push(...seleccionado.arcos.map(a=>({abanico:f.abanico,centro:a.centro,radio:a.radio,desde:a.desde,hasta:a.hasta,doble:f.operador==='OR'})));
            continue;
        }
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
