import type { Modelo, Id, RelacionIncompleta, Enlace, Operador, EnlaceProcedimental, Control, Opd } from './tipos';
import { esProcedimental, extremos } from './tipos';
import { noOfrecido } from './matriz';
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
        if (vistos.has(id)) return vistos.get(id);
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
        if (origen === undefined || destino === undefined) continue;
        if (origen === destino && (origen !== ex.origen || destino !== ex.destino || !fila.reflexivo)) continue;
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
    const continuidades = continuidadesTrazables(m, idx, [...abstraidos]);
    const invalidosTemporales = precedenciasInvalidas(m, idx, [...abstraidos]);
    const enlaces: EnlaceVisto[] = [], conflictos: Diagnostico[] = [], emitidos = new Set<EnlaceVisto[]>();
    for (const e of directos) {
        if (!esProcedimental(e.enlace)) { enlaces.push(e); continue; }
        const grupo = grupos.get(JSON.stringify([e.enlace.objeto, e.enlace.proceso]))!;
        if (!abstraidos.has(grupo)) { enlaces.push(e); continue; }
        if (emitidos.has(grupo)) continue;
        emitidos.add(grupo);
        const fusion = fusionar(grupo, idx, opd, compararTiempo, continuidades.get(grupo), invalidosTemporales.has(grupo));
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
        const primeraOriginal = m.enlaces[f.enlaces[0]!];
        if (!primeraOriginal || noOfrecido(m, primeraOriginal, f)) continue;
        const ramas = f.enlaces.map(id => porHecho.get(id));
        if (ramas.some(r => r === undefined) || new Set(ramas).size !== ramas.length) continue;
        const extremosRamas = ramas.map(r => extremos(r!.enlace));
        const a = extremosRamas[0];
        if (!a) continue;
        const desde = extremosRamas.every(x => x.origen === a.origen);
        const hacia = extremosRamas.every(x => x.destino === a.destino);
        if (!desde && !hacia) continue;
        if (new Set(ramas.map(r => r!.clave)).size !== ramas.length) continue;
        // Ramas por estados de un mismo objeto: el común es el proceso (DESIGN §4.3.2).
        const primera = ramas[0]!.enlace;
        const comun = desde && hacia && esProcedimental(primera) ? primera.proceso : desde ? a.origen : a.destino;
        abanicos.push({ abanico: f.id, operador: f.operador, ramas: ramas.map(r => r!.enlace.id), comun });
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

// Fuerza de los hechos originales; no asigna ids ni sintetiza una Vista.
export function hechoDeMayorFuerza(hechos: readonly EnlaceProcedimental[]): EnlaceProcedimental {
    const transformadores = hechos.filter(e => e.tipo === 'consumo' || e.tipo === 'resultado');
    const tipo = hechos.some(e => e.tipo === 'efecto') ? 'efecto' : hechos.some(e => e.tipo === 'agente') ? 'agente' : 'instrumento';
    const clase = transformadores.length ? transformadores : hechos.filter(e => e.tipo === tipo);
    return clase.reduce((a, b) => fuerzaControl(b) > fuerzaControl(a) ? b : a);
}

function fusionar(grupo: readonly EnlaceVisto[], idx: Indice, opd: Id, compararTiempo: (a: Id, b: Id) => number, continuidad?: EnlaceProcedimental, temporalInvalida = false): { enlaces: readonly EnlaceVisto[]; conflictos: readonly Diagnostico[] } {
    if (grupo.length === 1) return { enlaces: grupo, conflictos: [] };
    const hechos = grupo.map(v => v.enlace as EnlaceProcedimental);
    const resultados = hechos.filter(e => e.tipo === 'resultado');
    const consumos = hechos.filter(e => e.tipo === 'consumo');
    // Ramas del mismo abanico que llegan al mismo extremo son un solo hecho visto (§4.6.5).
    const cantidad = (es: readonly EnlaceProcedimental[]) => new Set(es.map(e => idx.abanicoDeEnlace.get(e.id) ?? e.id)).size;
    const codigos: ('precedencia-invalida' | 'conflicto-resultado-consumo')[] = [];
    if (temporalInvalida || cantidad(resultados) > 1 || cantidad(consumos) > 1) codigos.push('precedencia-invalida');
    if (!temporalInvalida && resultados.length && consumos.length && !continuidad) codigos.push('conflicto-resultado-consumo');
    if (codigos.length) {
        const retenidos = colapsarRamas(grupo.filter(v => v.enlace.tipo === 'resultado' || v.enlace.tipo === 'consumo' || temporalInvalida && v.enlace.tipo === 'efecto'), idx);
        const primeros = new Set(retenidos[0]!.hechos);
        for (const v of grupo) if (v.enlace.tipo !== 'resultado' && v.enlace.tipo !== 'consumo' && !(temporalInvalida && v.enlace.tipo === 'efecto'))
            for (const id of v.hechos) primeros.add(id);
        const hechosPrimero = grupo.flatMap(v => v.hechos).filter(id => primeros.has(id));
        const enlaces = retenidos.map((v, i) => {
            const ids = i === 0 ? hechosPrimero : v.hechos;
            const enlace = { ...v.enlace, id: ids[0]! };
            return { ...v, enlace, clave: clave(enlace), hechos: ids };
        });
        const conflictos = codigos.map((codigo): Diagnostico => ({ codigo, regla: codigo === 'precedencia-invalida' ? 'R-PREC-1' : 'R-PREC-3',
            severidad: codigo === 'precedencia-invalida' ? 'error' : 'warning', familia: 'contencion', mensaje: codigo === 'precedencia-invalida' ? 'Precedencia transformadora inválida al abstraer.' : 'Resultado y consumo sin continuidad trazable.',
            accion: 'Corregir el nivel hijo', refs: retenidos.flatMap(v => v.hechos.map(id => ({ tipo: 'enlace' as const, id }))), opd }));
        return { enlaces, conflictos };
    }
    if (continuidad) {
        const ids = grupo.flatMap(v => v.hechos);
        const enlace = { ...continuidad, id: ids[0]! };
        return { enlaces: [{ clave: clave(enlace), enlace, hechos: ids, abstraido: true }], conflictos: [] };
    }
    const elegido = hechoDeMayorFuerza(hechos), tipo = elegido.tipo;
    const clase = hechos.filter(e => e.tipo === tipo);
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

/** R-PREC-2 no usa los extremos ya abstraídos para probar identidad ni continuidad.
 * Las bandas ordenan los hechos una vez; el árbol original distingue secuencia de paralelo. */
function continuidadesTrazables(m: Modelo, idx: Indice, grupos: readonly (readonly EnlaceVisto[])[]): ReadonlyMap<readonly EnlaceVisto[], EnlaceProcedimental> {
    type R = Extract<EnlaceProcedimental, { tipo: 'resultado' }>;
    type C = Extract<EnlaceProcedimental, { tipo: 'consumo' }>;
    interface Candidato { grupo: readonly EnlaceVisto[]; r: R; c: C; orden: EnlaceProcedimental[]; consultas: number[] }
    const candidatos: Candidato[] = [];
    for (const grupo of grupos) {
        const originales = grupo.flatMap(v => v.hechos.map(id => m.enlaces[id])).filter((e): e is EnlaceProcedimental => e !== undefined && esProcedimental(e));
        const rs = originales.filter((e): e is R => e.tipo === 'resultado'), cs = originales.filter((e): e is C => e.tipo === 'consumo');
        // Un fan con alternativas no acredita una única trayectoria de estados.
        if (rs.length !== 1 || cs.length !== 1) continue;
        const r = rs[0]!, c = cs[0]!, objeto = m.cosas[r.objeto];
        if (objeto?.tipo !== 'objeto' || r.objeto !== c.objeto || r.estado === undefined || c.estado === undefined) continue;
        const propio = (estado: Id) => idx.estadoDe.get(estado)?.objeto === r.objeto;
        if (!propio(r.estado) || !propio(c.estado)) continue;
        if (originales.some(e => e.objeto !== r.objeto || e.tipo === 'efecto' && (e.entrada === undefined || e.salida === undefined || !propio(e.entrada) || !propio(e.salida)))) continue;
        candidatos.push({ grupo, r, c, orden: [], consultas: [] });
    }
    const resultado = new Map<readonly EnlaceVisto[], EnlaceProcedimental>();
    if (!candidatos.length) return resultado;
    let tiempos = tiemposMemo.get(m);
    if (!tiempos) { tiempos = ordenarBandas(m, idx); tiemposMemo.set(m, tiempos); }
    const entradas: { candidato: Candidato; enlace: EnlaceProcedimental; rango: number }[] = [];
    for (const candidato of candidatos) for (const v of candidato.grupo) for (const id of v.hechos) {
        const e = m.enlaces[id];
        if (!e || !esProcedimental(e) || !['resultado', 'consumo', 'efecto'].includes(e.tipo)) continue;
        entradas.push({ candidato, enlace: e, rango: tiempos.get(e.proceso) ?? 0 });
    }
    for (const x of ordenarRangos(entradas)) x.candidato.orden.push(x.enlace);
    const consultas: { a: Id; b: Id }[] = [], preparados: Candidato[] = [];
    for (const candidato of candidatos) {
        const { r, c, orden } = candidato;
        const primero = orden[0], ultimo = orden.at(-1);
        if (!primero || !ultimo || !((primero.id === r.id && ultimo.id === c.id) || (primero.id === c.id && ultimo.id === r.id))) continue;
        let estado = 'estado' in primero ? primero.estado : undefined, coherente = true;
        for (const e of orden.slice(1, -1)) {
            if (e.tipo !== 'efecto' || e.entrada !== estado) { coherente = false; break; }
            estado = e.salida;
        }
        if (!coherente || estado !== ('estado' in ultimo ? ultimo.estado : undefined)) continue;
        for (let i = 1; i < orden.length; i++) {
            candidato.consultas.push(consultas.length);
            consultas.push({ a: orden[i - 1]!.proceso, b: orden[i]!.proceso });
        }
        preparados.push(candidato);
    }
    const anteriores = secuenciaOriginal(m, idx, consultas);
    for (const candidato of preparados) {
        if (!candidato.consultas.every(i => anteriores[i])) continue;
        const { r, c, grupo, orden } = candidato;
        // El resultado no es entrada de control; tampoco lo son habilitadores absorbidos.
        const entradas = orden.filter(e => e.tipo === 'consumo' || e.tipo === 'efecto');
        const fuerte = entradas.reduce((a, b) => fuerzaControl(b) > fuerzaControl(a) ? b : a);
        const control = 'control' in fuerte ? fuerte.control : undefined;
        const visto = grupo.find(v => esProcedimental(v.enlace))!.enlace as EnlaceProcedimental;
        const mult = c.mult ?? r.mult;
        resultado.set(grupo, { id: grupo[0]!.hechos[0]!, tipo: 'efecto', objeto: r.objeto, proceso: visto.proceso,
            entrada: (orden[0] as R | C).estado!, salida: (orden.at(-1) as R | C).estado!, ...(control ? { control } : {}), ...(mult ? { mult } : {}) });
    }
    return resultado;
}

/** Radix estable: siete dígitos base 256 cubren todos los enteros seguros de Number.
 * División (sin coerción bitwise) conserva los mismos rangos y sus empates. Las pasadas
 * recorren sólo hechos y 256 contadores, nunca los huecos hasta el mayor rango. */
function ordenarRangos<T extends { readonly rango: number }>(elementos: readonly T[]): readonly T[] {
    if (elementos.length < 2) return elementos;
    let actual = [...elementos], divisor = 1;
    for (let pasada = 0; pasada < 7; pasada++, divisor *= 256) {
        const posiciones = Array<number>(256).fill(0);
        const digito = (e: T) => Math.floor(e.rango / divisor) % 256;
        for (const e of actual) posiciones[digito(e)]!++;
        let inicio = 0;
        for (let i = 0; i < posiciones.length; i++) {
            const cantidad = posiciones[i]!; posiciones[i] = inicio; inicio += cantidad;
        }
        const siguiente = Array<T>(actual.length);
        for (const e of actual) siguiente[posiciones[digito(e)]!++] = e;
        actual = siguiente;
    }
    return actual;
}

interface OrdenOriginal {
    readonly primero: ReadonlyMap<Id, number>; readonly segundo: ReadonlyMap<Id, number>;
    readonly fin: ReadonlyMap<Id, number>; readonly componente: ReadonlyMap<Id, Id>;
    readonly anterior: (a: Id, b: Id) => boolean;
}
const secuenciasMemo = new WeakMap<Modelo, OrdenOriginal>();
/** Dos órdenes del bosque original: las bandas no cambian de orden, sólo se invierten
 * miembros paralelos en la segunda pasada. Componente e intervalos excluyen raíces
 * ajenas y ancestros. Preparación iterativa compartida O(D+P); consulta O(1). */
function ordenOriginal(m: Modelo, idx: Indice): OrdenOriginal {
    let certificado = secuenciasMemo.get(m);
    if (!certificado) {
        const bandas = new Map<Id, readonly (readonly Id[])[]>();
        for (const id of idx.preorden) {
            const o = m.opds[id]!;
            if (o.tipo === 'descomposicion') bandas.set(o.cosa, o.bandas);
        }
        const raices = [...bandas.keys()].filter(id => !idx.subprocesoDe.has(id));
        const primero = new Map<Id, number>(), segundo = new Map<Id, number>(), fin = new Map<Id, number>(), componente = new Map<Id, Id>();
        type Paso = { id: Id; raiz: Id; salida: boolean };
        for (const invertir of [false, true]) {
            const orden = invertir ? segundo : primero, pendientes: Paso[] = [];
            for (let i = raices.length - 1; i >= 0; i--) pendientes.push({ id: raices[i]!, raiz: raices[i]!, salida: false });
            let posicion = 0;
            while (pendientes.length) {
                const { id, raiz, salida } = pendientes.pop()!;
                if (salida) { if (!invertir) fin.set(id, posicion); continue; }
                orden.set(id, posicion++);
                if (!invertir) componente.set(id, raiz);
                pendientes.push({ id, raiz, salida: true });
                const hijos = bandas.get(id) ?? [];
                for (let b = hijos.length - 1; b >= 0; b--) {
                    const miembros = hijos[b]!;
                    if (invertir) {
                        for (let i = 0; i < miembros.length; i++) pendientes.push({ id: miembros[i]!, raiz, salida: false });
                    } else {
                        for (let i = miembros.length - 1; i >= 0; i--) pendientes.push({ id: miembros[i]!, raiz, salida: false });
                    }
                }
            }
        }
        const anterior = (a: Id, b: Id) => {
            const x = primero.get(a), y = primero.get(b), u = segundo.get(a), v = segundo.get(b);
            if (x === undefined || y === undefined || u === undefined || v === undefined || componente.get(a) !== componente.get(b)) return false;
            if (x <= y && y < fin.get(a)! || y <= x && x < fin.get(b)!) return false;
            return x < y && u < v;
        };
        certificado = { primero, segundo, fin, componente, anterior };
        secuenciasMemo.set(m, certificado);
    }
    return certificado;
}
function secuenciaOriginal(m: Modelo, idx: Indice, consultas: readonly { a: Id; b: Id }[]): readonly boolean[] {
    if (!consultas.length) return [];
    const certificado = ordenOriginal(m, idx);
    return consultas.map(({ a, b }) => certificado.anterior(a, b));
}


/** DEC31: testigos C→E o E→R en el árbol original, sin comparar todos los pares.
 * Un barrido por fin/inicio excluye ancestros. El segundo orden excluye hermanos
 * paralelos: ambos órdenes deben acreditar antes→después, dentro de la misma raíz.
 * Radix y mínimos por grupo/componente conservan O(D+P+E), incluidos grupos grandes. */
function precedenciasInvalidas(m: Modelo, idx: Indice, grupos: readonly (readonly EnlaceVisto[])[]): ReadonlySet<readonly EnlaceVisto[]> {
    const relevantes = grupos.filter(g => g.some(v => v.enlace.tipo === 'efecto') && g.some(v => v.enlace.tipo === 'consumo' || v.enlace.tipo === 'resultado'));
    const invalidos = new Set<readonly EnlaceVisto[]>();
    if (!relevantes.length) return invalidos;
    const o = ordenOriginal(m, idx);
    interface Hecho { grupo: readonly EnlaceVisto[]; tipo: 'consumo' | 'efecto' | 'resultado'; componente: Id; segundo: number; rango: number }
    const fuentes: Hecho[] = [], consultas: Hecho[] = [];
    for (const grupo of relevantes) for (const v of grupo) for (const id of v.hechos) {
        const e = m.enlaces[id];
        if (!e || !esProcedimental(e) || !(e.tipo === 'consumo' || e.tipo === 'efecto' || e.tipo === 'resultado')) continue;
        const componente = o.componente.get(e.proceso), segundo = o.segundo.get(e.proceso), inicio = o.primero.get(e.proceso), fin = o.fin.get(e.proceso);
        if (componente === undefined || segundo === undefined || inicio === undefined || fin === undefined) continue;
        const hecho = { grupo, tipo: e.tipo, componente, segundo };
        if (e.tipo !== 'resultado') fuentes.push({ ...hecho, rango: fin });
        if (e.tipo !== 'consumo') consultas.push({ ...hecho, rango: inicio });
    }
    const ordenados = ordenarRangos(fuentes);
    const vistos = new Map<readonly EnlaceVisto[], Map<Id, { consumo: number; efecto: number }>>();
    let i = 0;
    for (const consulta of ordenarRangos(consultas)) {
        while (i < ordenados.length && ordenados[i]!.rango <= consulta.rango) {
            const f = ordenados[i++]!;
            let componentes = vistos.get(f.grupo); if (!componentes) { componentes = new Map(); vistos.set(f.grupo, componentes); }
            let minimo = componentes.get(f.componente); if (!minimo) { minimo = { consumo: Infinity, efecto: Infinity }; componentes.set(f.componente, minimo); }
            if (f.tipo === 'consumo') minimo.consumo = Math.min(minimo.consumo, f.segundo);
            else minimo.efecto = Math.min(minimo.efecto, f.segundo);
        }
        const minimo = vistos.get(consulta.grupo)?.get(consulta.componente);
        if (minimo && (consulta.tipo === 'efecto' ? minimo.consumo : minimo.efecto) < consulta.segundo) invalidos.add(consulta.grupo);
    }
    return invalidos;
}
