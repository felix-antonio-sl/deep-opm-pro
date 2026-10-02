import type { Modelo, Id, RelacionIncompleta, Enlace, Operador, EnlaceProcedimental, Control, Opd } from './tipos';
import { esProcedimental, extremos } from './tipos';
import { indice } from './indice';
import type { Indice } from './indice';
import { MATRIZ } from './matriz';
import type { Diagnostico } from './diagnostico';
export interface Vista {
    readonly opd: Id;
    readonly clase: 'raiz' | 'descomposicion' | 'despliegue';
    readonly cosas: readonly CosaVista[];
    readonly enlaces: readonly EnlaceVisto[];
    readonly abanicos: readonly AbanicoVisto[];
    readonly incompletas: readonly {
        readonly refinable: Id;
        readonly relacion: RelacionIncompleta;
        readonly declarada: boolean;
    }[];
    readonly conflictos: readonly Diagnostico[]; // AP-30 / R-PREC-3 de este OPD
}
export interface CosaVista {
    readonly cosa: Id;
    readonly rol: 'libre' | 'contenedor' | 'subproceso' | 'interno' | 'externo' | 'refinable';
    readonly banda?: number; // subprocesos
    readonly estadosVisibles: readonly Id[]; // en el orden del modelo
    readonly ocultos: number; // chip ⋯N y D6
}
export interface EnlaceVisto {
    readonly clave: string; // estable: tipo|extremos vistos|estados|control
    readonly enlace: Enlace; // hecho visto (sintetizado si abstraído; id = primer subyacente)
    readonly hechos: readonly Id[]; // enlaces del modelo que representa (1 si es directo)
    readonly abstraido: boolean;
}
export interface AbanicoVisto {
    readonly abanico: Id;
    readonly operador: Operador;
    readonly ramas: readonly Id[];
    readonly comun: Id;
}
const memo = new WeakMap<Modelo, Map<Id, Vista>>();

/** La vista nunca se persiste: conserva ids/procedencia y solo abstrae procesos de in-zoom. */
export function proyectar(m: Modelo, opd: Id): Vista {
    const previa = memo.get(m)?.get(opd);
    if (previa) return previa;
    const o = m.opds[opd];
    if (!o) throw new Error(`OPD inexistente: ${opd}`);
    const idx = indice(m);
    const internos = alcance(m, o);
    const vistos = new Map<Id, Id | undefined>();
    function visto(id: Id): Id | undefined {
        const camino: Id[] = [], visitados = new Set<Id>();
        let actual: Id | undefined = id;
        while (actual !== undefined && !vistos.has(actual)) {
            if (Object.hasOwn(o!.apariciones, actual)) break;
            if (visitados.has(actual)) { actual = undefined; break; }
            camino.push(actual); visitados.add(actual);
            const dueño: Id | undefined = m.cosas[actual]?.tipo === 'proceso' ? idx.internoDe.get(actual) : undefined;
            const d: Opd | undefined = dueño ? m.opds[dueño] : undefined;
            actual = d?.tipo === 'descomposicion' ? d.cosa : undefined;
        }
        const resultado = actual === undefined ? undefined : vistos.has(actual) ? vistos.get(actual) : actual;
        for (const c of camino) vistos.set(c, resultado);
        vistos.set(id, resultado);
        return resultado;
    }

    const directos: EnlaceVisto[] = [];
    for (const e of Object.values(m.enlaces)) {
        const fila = MATRIZ[e.tipo], ex = extremos(e);
        const noAbstraer = fila.familia === 'estructural' || fila.familia === 'etiquetada';
        const origen = noAbstraer ? (Object.hasOwn(o.apariciones, ex.origen) ? ex.origen : undefined) : visto(ex.origen);
        const destino = noAbstraer ? (Object.hasOwn(o.apariciones, ex.destino) ? ex.destino : undefined) : visto(ex.destino);
        if (origen === undefined || destino === undefined || (origen === destino && !fila.reflexivo)) continue;
        if (o.tipo !== 'raiz' && !internos.has(origen) && !internos.has(destino)) continue;
        const abstraido = origen !== ex.origen || destino !== ex.destino;
        const enlace: Enlace = !abstraido ? e : esProcedimental(e)
            ? { ...e, objeto: visto(e.objeto)!, proceso: visto(e.proceso)! }
            : { ...e, origen, destino } as Enlace;
        directos.push({ clave: clave(enlace), enlace, hechos: [e.id], abstraido });
    }

    const grupos = new Map<string, EnlaceVisto[]>();
    for (const e of directos) {
        if (!esProcedimental(e.enlace)) continue;
        const par = JSON.stringify([e.enlace.objeto, e.enlace.proceso]);
        const grupo = grupos.get(par) ?? [];
        grupo.push(e); grupos.set(par, grupo);
    }
    const abstraidos = new Set([...grupos.values()].filter(g => g.some(e => e.abstraido)));
    const compararTiempo = comparadorTemporal(m, idx);
    const enlaces: EnlaceVisto[] = [], conflictos: Diagnostico[] = [], emitidos = new Set<EnlaceVisto[]>();
    for (const e of directos) {
        if (!esProcedimental(e.enlace)) { enlaces.push(e); continue; }
        const grupo = grupos.get(JSON.stringify([e.enlace.objeto, e.enlace.proceso]))!;
        if (!abstraidos.has(grupo)) { enlaces.push(e); continue; }
        if (emitidos.has(grupo)) continue;
        emitidos.add(grupo);
        const fusion = fusionar(grupo, idx, opd, compararTiempo);
        enlaces.push(...fusion.enlaces); conflictos.push(...fusion.conflictos);
    }

    const porHecho = new Map<Id, EnlaceVisto>();
    const anclados = new Set<Id>();
    for (const e of enlaces) {
        for (const id of e.hechos) porHecho.set(id, e);
        for (const id of estados(e.enlace)) anclados.add(id);
    }
    const abanicos: AbanicoVisto[] = [];
    for (const f of Object.values(m.abanicos)) {
        const ramas = f.enlaces.map(id => porHecho.get(id));
        if (ramas.some(r => r === undefined) || new Set(ramas).size !== ramas.length) continue;
        const extremosRamas = ramas.map(r => extremos(r!.enlace));
        const a = extremosRamas[0];
        if (!a) continue;
        const desde = extremosRamas.every(x => x.origen === a.origen);
        const hacia = extremosRamas.every(x => x.destino === a.destino);
        if (!desde && !hacia) continue;
        if (new Set(extremosRamas.map(x => desde ? x.destino : x.origen)).size !== ramas.length) continue;
        abanicos.push({ abanico: f.id, operador: f.operador, ramas: ramas.map(r => r!.enlace.id), comun: desde ? a.origen : a.destino });
    }
    const cosas: CosaVista[] = Object.keys(o.apariciones).map(id => {
        const c = m.cosas[id]!;
        const banda = o.tipo === 'descomposicion' ? idx.subprocesoDe.get(id) : undefined;
        const rol: CosaVista['rol'] = o.tipo === 'raiz' ? 'libre' : id === o.cosa ? (o.tipo === 'descomposicion' ? 'contenedor' : 'refinable')
            : banda?.opd === opd ? 'subproceso' : internos.has(id) ? 'interno' : 'externo';
        const propios = c.tipo === 'objeto' ? c.estados : [];
        const ocultos = new Set(o.apariciones[id]!.ocultos ?? []);
        const estadosVisibles = propios.filter(s => anclados.has(s.id) || (!s.suprimido && !ocultos.has(s.id))).map(s => s.id);
        return { cosa: id, rol, ...(rol === 'subproceso' ? { banda: banda!.banda } : {}), estadosVisibles, ocultos: propios.length - estadosVisibles.length };
    });
    const incompletas = colecciones(m, o);
    const vista: Vista = { opd, clase: o.tipo, cosas, enlaces, abanicos, incompletas, conflictos };
    const porOpd = memo.get(m) ?? new Map<Id, Vista>();
    porOpd.set(opd, vista); memo.set(m, porOpd);
    return vista;
}

export function etiquetaOpd(m: Modelo, opd: Id): string {
    const etiqueta = indice(m).etiqueta.get(opd);
    if (etiqueta === undefined) throw new Error(`OPD inexistente: ${opd}`);
    return etiqueta;
}
export function opdsEnPreorden(m: Modelo): readonly Id[] { return indice(m).preorden; }

function alcance(m: Modelo, o: Opd): ReadonlySet<Id> {
    if (o.tipo === 'raiz') return new Set();
    if (o.tipo === 'descomposicion') return new Set([o.cosa, ...o.objetosInternos, ...o.bandas.flat()]);
    const ids = new Set([o.cosa]);
    for (const e of Object.values(m.enlaces))
        if (e.tipo === o.modo && 'refinable' in e && e.refinable === o.cosa) ids.add(e.refinador);
    return ids;
}

function estados(e: Enlace): readonly Id[] {
    switch (e.tipo) {
        case 'consumo': case 'resultado': case 'agente': case 'instrumento': return e.estado ? [e.estado] : [];
        case 'efecto': return [e.entrada, e.salida].filter((s): s is Id => s !== undefined);
        case 'generalizacion': return e.estados ? [e.estados.general, e.estados.especializacion] : [];
        case 'etiquetado': return [e.estadoOrigen, e.estadoDestino].filter((s): s is Id => s !== undefined);
        case 'etiquetadoBidireccional': return e.estadoOrigen ? [e.estadoOrigen] : [];
        case 'reciproco': return e.estados ? [e.estados.origen, ...(e.estados.destino ? [e.estados.destino] : [])] : [];
        default: return [];
    }
}
function clave(e: Enlace): string {
    const x = extremos(e);
    return JSON.stringify([e.tipo, x.origen, x.destino, estados(e), 'control' in e ? e.control ?? null : null]);
}
const fuerzaControl = (e: EnlaceProcedimental): number => 'control' in e ? e.control === 'e' ? 2 : e.control === 'c' ? 0 : 1 : 1;

function fusionar(grupo: readonly EnlaceVisto[], idx: Indice, opd: Id, compararTiempo: (a: Id, b: Id) => number): { enlaces: readonly EnlaceVisto[]; conflictos: readonly Diagnostico[] } {
    if (grupo.length === 1) return { enlaces: grupo, conflictos: [] };
    const hechos = grupo.map(v => v.enlace as EnlaceProcedimental);
    const resultados = hechos.filter(e => e.tipo === 'resultado');
    const consumos = hechos.filter(e => e.tipo === 'consumo');
    // Ramas del mismo abanico que llegan al mismo extremo son un solo hecho visto (§4.6.5).
    const cantidad = (es: readonly EnlaceProcedimental[]) => new Set(es.map(e => idx.abanicoDeEnlace.get(e.id) ?? e.id)).size;
    const codigos: ('precedencia-invalida' | 'conflicto-resultado-consumo')[] = [];
    if (cantidad(resultados) > 1 || cantidad(consumos) > 1) codigos.push('precedencia-invalida');
    if (resultados.length && consumos.length) codigos.push('conflicto-resultado-consumo');
    if (codigos.length) {
        const retenidos = colapsarRamas(grupo.filter(v => v.enlace.tipo === 'resultado' || v.enlace.tipo === 'consumo'), idx);
        const primeros = new Set(retenidos[0]!.hechos);
        for (const v of grupo) if (v.enlace.tipo !== 'resultado' && v.enlace.tipo !== 'consumo')
            for (const id of v.hechos) primeros.add(id);
        const hechosPrimero = grupo.flatMap(v => v.hechos).filter(id => primeros.has(id));
        const enlaces = retenidos.map((v, i) => {
            const ids = i === 0 ? hechosPrimero : v.hechos;
            const enlace = { ...v.enlace, id: ids[0]! };
            return { ...v, enlace, clave: clave(enlace), hechos: ids };
        });
        const conflictos = codigos.map((codigo): Diagnostico => ({ codigo, regla: codigo === 'precedencia-invalida' ? 'R-PREC-1' : 'R-PREC-3',
            severidad: 'error', familia: 'gramatical', mensaje: codigo === 'precedencia-invalida' ? 'Precedencia transformadora inválida al abstraer.' : 'Resultado y consumo sin continuidad trazable.',
            accion: 'Corregir el nivel hijo', refs: retenidos.flatMap(v => v.hechos.map(id => ({ tipo: 'enlace' as const, id }))), opd }));
        return { enlaces, conflictos };
    }
    const tipo: EnlaceProcedimental['tipo'] = resultados.length ? 'resultado' : consumos.length ? 'consumo'
        : hechos.some(e => e.tipo === 'efecto') ? 'efecto' : hechos.some(e => e.tipo === 'agente') ? 'agente' : 'instrumento';
    const clase = hechos.filter(e => e.tipo === tipo);
    // Canon §6.5: comparar controles dentro de la clase retenida, nunca transferirlos de otra.
    const elegido = clase.reduce((a, b) => fuerzaControl(b) > fuerzaControl(a) ? b : a);
    const ids = grupo.flatMap(v => v.hechos);
    let enlace: EnlaceProcedimental = { ...elegido, id: ids[0]! };
    if (tipo === 'efecto') {
        const efectos = clase.filter((e): e is Extract<EnlaceProcedimental, { tipo: 'efecto' }> => e.tipo === 'efecto');
        let temprano: typeof efectos[number] | undefined, tardio: typeof efectos[number] | undefined;
        for (const e of efectos) {
            if (e.entrada !== undefined && (!temprano || compararTiempo(e.id, temprano.id) < 0)) temprano = e;
            if (e.salida !== undefined && (!tardio || compararTiempo(e.id, tardio.id) >= 0)) tardio = e;
        }
        const entrada = temprano?.entrada, salida = tardio?.salida;
        const control: Control | undefined = 'control' in elegido ? elegido.control : undefined;
        enlace = { id: ids[0]!, tipo: 'efecto', objeto: elegido.objeto, proceso: elegido.proceso,
            ...(elegido.mult ? { mult: elegido.mult } : {}), ...(entrada ? { entrada } : {}), ...(salida ? { salida } : {}), ...(control ? { control } : {}) };
    }
    return { enlaces: [{ clave: clave(enlace), enlace, hechos: ids, abstraido: true }], conflictos: [] };
}

/** Colapsar el abanico es independiente de que sobreviva una colisión con otro hecho. */
function colapsarRamas(grupo: readonly EnlaceVisto[], idx: Indice): readonly EnlaceVisto[] {
    const agrupacion = (v: EnlaceVisto): string | undefined => {
        const f = idx.abanicoDeEnlace.get(v.enlace.id);
        // Un fan cargado puede tener clases incompatibles: R+C debe conservarse aun así.
        return f === undefined ? undefined : JSON.stringify([f, v.enlace.tipo]);
    };
    const porAbanico = new Map<Id, EnlaceVisto[]>();
    for (const v of grupo) {
        const f = agrupacion(v);
        if (f === undefined) continue;
        const ramas = porAbanico.get(f) ?? [];
        ramas.push(v); porAbanico.set(f, ramas);
    }
    const emitidos = new Set<Id>(), vistos: EnlaceVisto[] = [];
    for (const v of grupo) {
        const f = agrupacion(v);
        if (f === undefined) { vistos.push(v); continue; }
        if (emitidos.has(f)) continue;
        emitidos.add(f);
        const ramas = porAbanico.get(f)!;
        if (ramas.length === 1) { vistos.push(v); continue; }
        const elegido = ramas.reduce((a, b) => fuerzaControl(b.enlace as EnlaceProcedimental) > fuerzaControl(a.enlace as EnlaceProcedimental) ? b : a);
        const hechos = ramas.flatMap(r => r.hechos);
        const enlace = { ...elegido.enlace, id: hechos[0]! };
        vistos.push({ clave: clave(enlace), enlace, hechos, abstraido: true });
    }
    return vistos;
}

const tiemposMemo = new WeakMap<Modelo, ReadonlyMap<Id, number>>();
function comparadorTemporal(m: Modelo, idx: Indice): (hechoA: Id, hechoB: Id) => number {
    let tiempos = tiemposMemo.get(m);
    const tiempo = (hecho: Id): number => {
        if (!tiempos) { tiempos = ordenarBandas(m, idx); tiemposMemo.set(m, tiempos); }
        // La banda pertenece al extremo nuclear original, no al contenedor ya abstraído.
        const e = m.enlaces[hecho];
        const id = e && esProcedimental(e) ? e.proceso : hecho;
        return tiempos.get(id) ?? 0;
    };
    return (a, b) => tiempo(a) - tiempo(b);
}

function ordenarBandas(m: Modelo, idx: Indice): ReadonlyMap<Id, number> {
    interface Tiempo { hijos: Map<number, Tiempo>; orden: number }
    const nuevo = (): Tiempo => ({ hijos: new Map(), orden: 0 });
    const raiz = nuevo(), porProceso = new Map<Id, Tiempo>();
    // El preorden único del índice asegura que se conoce el tiempo del contenedor antes
    // de sus subprocesos. Un mismo prefijo de bandas comparte nodo, incluso en paralelo.
    for (const id of idx.preorden) {
        const o = m.opds[id]!;
        if (o.tipo !== 'descomposicion') continue;
        const padre = porProceso.get(o.cosa) ?? raiz;
        o.bandas.forEach((banda, posicion) => {
            let tiempo = padre.hijos.get(posicion);
            if (!tiempo) { tiempo = nuevo(); padre.hijos.set(posicion, tiempo); }
            for (const proceso of banda) porProceso.set(proceso, tiempo);
        });
    }
    // Cada prefijo se visita una vez; no hay rutas copiadas ni comparación por profundidad.
    // Los hijos se insertaron por posiciones 0..n, por lo que su orden ya es creciente.
    const pendientes = [raiz];
    let orden = 0;
    while (pendientes.length) {
        const t = pendientes.pop()!;
        t.orden = orden++;
        pendientes.push(...[...t.hijos.values()].reverse());
    }
    return new Map([...porProceso].map(([id, tiempo]) => [id, tiempo.orden]));
}

function colecciones(m: Modelo, o: Opd): Vista['incompletas'] {
    const lista = new Map<string, Vista['incompletas'][number]>();
    for (const id of Object.keys(o.apariciones))
        for (const relacion of m.cosas[id]?.incompleta ?? []) lista.set(JSON.stringify([id, relacion]), { refinable: id, relacion, declarada: true });
    for (const e of Object.values(m.enlaces)) {
        if (!('refinable' in e) || e.tipo === 'clasificacion' || !Object.hasOwn(o.apariciones, e.refinable) || Object.hasOwn(o.apariciones, e.refinador)) continue;
        const key = JSON.stringify([e.refinable, e.tipo]);
        if (!lista.has(key)) lista.set(key, { refinable: e.refinable, relacion: e.tipo, declarada: false });
    }
    return [...lista.values()];
}
