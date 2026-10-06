import type { Id, Modelo, Enlace, EnlaceNuevo, Operador, TipoEnlace, Control, Multiplicidad, Ref, Objeto } from './tipos';
import { extremos, esProcedimental } from './tipos';
import type { Operacion, Tx, CodigoRechazo } from './resultado';
import { transaccion } from './resultado';
import type { EstadosEnlace, ExtremoRef } from './operaciones';
import { indice } from './indice';
import { validarForma } from './forma';
import type { DatosEtiquetas } from './matriz';
import { MATRIZ, violacionesForma, normalizarEtiquetas, noOfrecido, violacionesContexto } from './matriz';
import { proyectar } from './proyeccion';
import { validarAbanicoTx } from './abanicos';
import { distribuirEnTx } from './refinamiento';
const ref = (id: Id): Ref => ({ tipo: 'enlace', id });
function negar(tx: Tx, codigo: CodigoRechazo, regla: string, mensaje: string, refs: readonly Ref[]): never {
    return tx.rechazar({ codigo, regla, mensaje, refs });
}
function obtener(tx: Tx, id: Id): Enlace {
    return (Object.hasOwn(tx.m.enlaces, id) ? tx.m.enlaces[id] : undefined) ?? negar(tx, 'no-encontrado', 'producto', 'El enlace ya no existe.', [ref(id)]);
}
function visible(tx: Tx, opd: Id, e: Enlace | EnlaceNuevo) {
    const o = Object.hasOwn(tx.m.opds, opd) ? tx.m.opds[opd] : undefined;
    if (!o)
        negar(tx, 'no-encontrado', 'producto', 'El OPD ya no existe.', [{ tipo: 'opd', id: opd }]);
    const ex = extremos(e), ids = [ex.origen, ex.destino];
    for (const [id, otro] of [[ids[0]!, ids[1]!], [ids[1]!, ids[0]!]] as const) {
        const propio = indice(tx.m).internoDe.get(id);
        if (propio && !Object.hasOwn(tx.m.opds[propio]!.apariciones, otro))
            negar(tx, 'interno-no-visible', 'T-066', 'Un interno solo enlaza cosas visibles en su OPD dueño.', [{ tipo: 'cosa', id }, { tipo: 'cosa', id: otro }, { tipo: 'opd', id: propio }]);
    }
    for (const id of ids)
        if (!Object.hasOwn(o.apariciones, id))
            negar(tx, 'no-visible', 'R-EDIT-1', 'Ambos extremos deben aparecer en el OPD.', [{ tipo: 'cosa', id }, { tipo: 'opd', id: opd }]);
}
function forma(tx: Tx, e: Enlace | EnlaceNuevo) {
    const v = violacionesForma(tx.m, e)[0];
    if (v)
        negar(tx, 'forma', v.regla, v.mensaje, v.refs.length ? v.refs : Object.values(extremos(e)).map(id => ({ tipo: 'cosa', id })));
    // F-4 pertenece a forma.ts. Solo el camino de un par persistido necesita ese control.
    if (e.tipo === 'efecto' && e.escision && 'id' in e) {
        const v = validarForma(tx.m).find(v => v.regla === 'F-4' && v.refs.some(r => r.tipo === 'enlace' && r.id === e.id));
        if (v) negar(tx, 'forma', v.regla, v.mensaje, v.refs);
    }
}
function canon(tx: Tx, e: Enlace): Enlace {
    const n = normalizarEtiquetas(e);
    if (!n.ok)
        tx.rechazar({ ...n.rechazo, refs: [ref(e.id)] });
    for (const t of n.trazas)
        tx.traza({ ...t, refs: [ref(e.id), ...t.refs] });
    return { ...n.valor, id: e.id };
}
function comprobar(tx: Tx, e: Enlace) {
    forma(tx, e);
    const fId = indice(tx.m).abanicoDeEnlace.get(e.id), f = fId ? tx.m.abanicos[fId] : undefined;
    if (f)
        validarAbanicoTx(tx, f);
    const nf = noOfrecido(tx.m, e, f);
    if (nf)
        negar(tx, 'no-ofrecido', nf.regla, nf.motivo, [ref(e.id), ...(f ? [{ tipo: 'abanico' as const, id: f.id }] : [])]);
}
function datos(e: Enlace | EnlaceNuevo): string {
    const ordenar = (x: unknown): unknown => Array.isArray(x) ? x.map(ordenar) : x !== null && typeof x === 'object' ? Object.fromEntries(Object.entries(x).filter(([k, v]) => k !== 'id' && v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, ordenar(v)])) : x;
    return JSON.stringify(ordenar(e));
}
function duplicado(tx: Tx, e: Enlace) {
    let firma: string | undefined;
    const otro = Object.values(tx.m.enlaces).find(x => {
        if (x.id === e.id || x.tipo !== e.tipo) return false;
        if ('objeto' in e && 'objeto' in x && (e.objeto !== x.objeto || e.proceso !== x.proceso)) return false;
        if ('refinable' in e && 'refinable' in x && (e.refinable !== x.refinable || e.refinador !== x.refinador)) return false;
        if ('origen' in e && 'origen' in x && (e.origen !== x.origen || e.destino !== x.destino)) return false;
        return datos(x) === (firma ??= datos(e));
    });
    if (otro)
        negar(tx, 'ya-existe', 'R-EDIT-1', 'El mismo enlace ya existe.', [ref(otro.id), ref(e.id)]);
}
function requiereDistribucion(tx: Tx, e: Enlace) { distribuirEnTx(tx, e.id, tx.m.raiz); }
function formaDistribucionFinal(tx: Tx): void {
    const v = validarForma(tx.m)[0];
    if (v) negar(tx, 'forma', v.regla, v.mensaje, v.refs);
}

function anclas(e: Enlace): readonly Id[] {
    switch (e.tipo) {
        case 'consumo':
        case 'resultado':
        case 'agente':
        case 'instrumento': return e.estado ? [e.estado] : [];
        case 'efecto': return [e.entrada, e.salida].filter((x): x is Id => x !== undefined);
        case 'generalizacion': return e.estados ? [e.estados.general, e.estados.especializacion] : [];
        case 'etiquetado': return [e.estadoOrigen, e.estadoDestino].filter((x): x is Id => x !== undefined);
        case 'etiquetadoBidireccional': return e.estadoOrigen ? [e.estadoOrigen] : [];
        case 'reciproco': return e.estados ? [e.estados.origen, ...(e.estados.destino ? [e.estados.destino] : [])] : [];
        default: return [];
    }
}
function mostrar(tx: Tx, id: Id) {
    const e = obtener(tx, id);
    mostrarUno(tx, id);
    if (e.tipo === 'efecto' && e.escision)
        mostrarUno(tx, e.escision.par);
}
function mostrarUno(tx: Tx, id: Id) {
    const e = obtener(tx, id), estados = anclas(e);
    if (!estados.length) return;
    const pendientes = new Map<Id, Set<Id>>();
    for (const oid of indice(tx.m).preorden) {
        const vista = proyectar(tx.m, oid);
        for (const s of estados)
            if (vista.enlaces.some(v => v.hechos.includes(id) && anclas(v.enlace).includes(s))) {
                const donde = pendientes.get(s) ?? new Set<Id>();
                donde.add(oid);
                pendientes.set(s, donde);
            }
    }
    for (const [s, opds] of pendientes) {
        const dueño = indice(tx.m).estadoDe.get(s)!;
        const c = tx.m.cosas[dueño.objeto] as Objeto, estado = c.estados[dueño.posicion]!;
        if (estado.suprimido) {
            const { suprimido, ...limpio } = estado;
            tx.poner('cosas', { ...c, estados: c.estados.map(x => x.id === s ? limpio : x) });
            tx.traza({ regla: 'LF-03', mensaje: `El estado ${estado.nombre} se mostró: tiene un anclaje visible.`, refs: [{ tipo: 'estado', id: s }, ref(id)] });
        }
        for (const oid of opds) {
            const o = tx.m.opds[oid]!, app = o.apariciones[c.id];
            if (!app?.ocultos?.includes(s))
                continue;
            const ocultos = app.ocultos.filter(x => x !== s), { ocultos: anteriores, ...resto } = app;
            tx.poner('opds', { ...o, apariciones: { ...o.apariciones, [c.id]: ocultos.length ? { ...resto, ocultos } : resto } });
            tx.traza({ regla: 'LF-03', mensaje: `El estado ${estado.nombre} se mostró en este OPD.`, refs: [{ tipo: 'estado', id: s }, { tipo: 'opd', id: oid }, ref(id)] });
        }
    }
}
function ambiente(tx: Tx, e: Enlace) {
    if (e.tipo !== 'exhibicion')
        return;
    const porRasgo = new Map<Id, Id[]>(), rasgos = new Map<Id, Id[]>();
    for (const x of Object.values(tx.m.enlaces))
        if (x.tipo === 'exhibicion') {
            porRasgo.set(x.refinador, [...(porRasgo.get(x.refinador) ?? []), x.refinable]);
            rasgos.set(x.refinable, [...(rasgos.get(x.refinable) ?? []), x.refinador]);
        }
    const padres = [e.refinable], vistos = new Set<Id>();
    let ambiental = false;
    while (padres.length) {
        const id = padres.pop()!;
        if (vistos.has(id))
            continue;
        vistos.add(id);
        if (tx.m.cosas[id]!.afiliacion === 'ambiental') {
            ambiental = true;
            break;
        }
        padres.push(...(porRasgo.get(id) ?? []));
    }
    if (!ambiental)
        return;
    const cola = [e.refinador];
    vistos.clear();
    while (cola.length) {
        const id = cola.pop()!;
        if (vistos.has(id))
            continue;
        vistos.add(id);
        const c = tx.m.cosas[id]!;
        if (c.afiliacion !== 'ambiental') {
            tx.poner('cosas', { ...c, afiliacion: 'ambiental' });
            tx.traza({ regla: 'R-OBJ-6', mensaje: `**${c.nombre}** pasó a ambiental por la exhibición.`, refs: [{ tipo: 'cosa', id }] });
        }
        cola.push(...(rasgos.get(id) ?? []));
    }
}
function valorHuerfano(tx: Tx, anterior: Enlace) {
    if (anterior.tipo !== 'exhibicion')
        return;
    const c = tx.m.cosas[anterior.refinador];
    if (c?.tipo !== 'objeto' || c.valor === undefined || Object.values(tx.m.enlaces).some(e => e.tipo === 'exhibicion' && e.refinador === c.id))
        return;
    const { valor, ...sin } = c;
    tx.poner('cosas', sin);
    tx.traza({ regla: 'F-13', mensaje: `El valor ${valor} de **${c.nombre}** se quitó: ya no es atributo.`, refs: [{ tipo: 'cosa', id: c.id }, ref(anterior.id)] });
}
function guardar(tx: Tx, anterior: Enlace, candidato: Enlace, ensayarDistribucion = false) {
    for (const id of anclas(anterior))
        if (!anclas(candidato).includes(id))
            tx.traza({ regla: 'R-OPD-OP-5', mensaje: 'La edición retiró un anclaje previo.', refs: [ref(anterior.id), { tipo: 'estado', id }] });
    const e = canon(tx, candidato);
    tx.poner('enlaces', e);
    comprobar(tx, e);
    duplicado(tx, e);
    if (ensayarDistribucion)
        requiereDistribucion(tx, e);
    valorHuerfano(tx, anterior);
    ambiente(tx, e);
    mostrar(tx, e.id);
    if (ensayarDistribucion) formaDistribucionFinal(tx);
}
function cambiarCampo(e: Enlace, campo: string, valor: unknown): Enlace {
    const n = { ...e } as unknown as Record<string, unknown>;
    if (valor === null || valor === undefined)
        delete n[campo];
    else
        n[campo] = valor;
    return n as unknown as Enlace;
}
export const crearEnlace: Operacion<{
    opd: Id;
    candidato: EnlaceNuevo;
    abanicoCon?: {
        enlace: Id;
        operador: Operador;
    };
}> = (m, a) => transaccion(m, tx => {
    const normal = normalizarEtiquetas(a.candidato);
    if (!normal.ok)
        return tx.rechazar({ ...normal.rechazo, refs: Object.values(extremos(a.candidato)).map(id => ({ tipo: 'cosa' as const, id })) });
    forma(tx, normal.valor);
    visible(tx, a.opd, normal.valor);
    const e: Enlace = { ...normal.valor, id: tx.nuevoId('e') };
    duplicado(tx, e);
    tx.poner('enlaces', e);
    for (const t of normal.trazas)
        tx.traza({ ...t, refs: [ref(e.id), ...t.refs] });
    if (a.abanicoCon) {
        const otro = obtener(tx, a.abanicoCon.enlace), fid = indice(m).abanicoDeEnlace.get(otro.id), previo = fid ? tx.m.abanicos[fid] : undefined;
        const f = { id: previo?.id ?? tx.nuevoId('f'), operador: a.abanicoCon.operador, enlaces: [...(previo?.enlaces ?? [otro.id]), e.id] };
        validarAbanicoTx(tx, f);
        tx.poner('abanicos', f);
    }
    comprobar(tx, e);
    requiereDistribucion(tx, e);
    ambiente(tx, e);
    mostrar(tx, e.id);
    formaDistribucionFinal(tx);
});
export const fijarEstados: Operacion<{
    enlace: Id;
    estados: EstadosEnlace;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace), f = MATRIZ[e.tipo], s = a.estados as unknown as Record<string, unknown>;
    const esperados = f.estados === 'objeto' ? ['estado'] : f.estados === 'entradaSalida' ? ['entrada', 'salida'] : f.estados === 'parGeneralizacion' ? ['generalizacion'] : ['origen', 'destino'];
    if (f.estados === 'ninguno' || Object.keys(s).length !== esperados.length || esperados.some(k => !Object.hasOwn(s, k)))
        negar(tx, 'tipo-incompatible', 'R-EDIT-2', 'La forma de estados no corresponde al tipo de enlace.', [ref(e.id)]);
    let n = e;
    switch (f.estados) {
        case 'objeto':
            n = cambiarCampo(e, 'estado', s.estado);
            break;
        case 'entradaSalida':
            n = cambiarCampo(cambiarCampo(e, 'entrada', s.entrada), 'salida', s.salida);
            break;
        case 'parGeneralizacion':
            n = cambiarCampo(e, 'estados', s.generalizacion);
            break;
        case 'origenDestino':
            n = cambiarCampo(cambiarCampo(e, 'estadoOrigen', s.origen), 'estadoDestino', s.destino);
            break;
        case 'soloOrigen':
            if (s.destino !== null)
                negar(tx, 'forma', 'AP-11', 'El bidireccional solo admite estado en origen.', [ref(e.id)]);
            n = cambiarCampo(e, 'estadoOrigen', s.origen);
            break;
        case 'simetrico':
            if (s.origen === null && s.destino !== null)
                negar(tx, 'forma', 'AP-11', 'El recíproco no admite estado solo en destino.', [ref(e.id)]);
            n = cambiarCampo(e, 'estados', s.origen === null ? null : { origen: s.origen, ...(s.destino !== null ? { destino: s.destino } : {}) });
            break;
    }
    guardar(tx, e, n);
});
export const fijarControl: Operacion<{
    enlace: Id;
    control: Control | null;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace);
    guardar(tx, e, cambiarCampo(e, 'control', a.control));
});
export const fijarEtiqueta: Operacion<{
    enlace: Id;
    etiqueta: string | null;
    inversa?: string | null;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace);
    if (MATRIZ[e.tipo].etiquetas === 'ninguna')
        negar(tx, 'tipo-incompatible', 'R-OPL-SE-2', 'Este tipo no tiene etiqueta.', [ref(e.id)]);
    let n = cambiarCampo(e, 'etiqueta', a.etiqueta);
    if (a.inversa !== undefined) {
        if (e.tipo !== 'etiquetadoBidireccional')
            negar(tx, 'tipo-incompatible', 'R-OPL-SE-2', 'Solo el bidireccional tiene etiqueta inversa.', [ref(e.id)]);
        n = cambiarCampo(n, 'inversa', a.inversa);
    }
    guardar(tx, e, n);
});
export const fijarRuta: Operacion<{
    enlace: Id;
    ruta: string | null;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace);
    if (!MATRIZ[e.tipo].ruta)
        negar(tx, 'forma', 'R-OPL-RUTA-2', 'La ruta solo se admite en consumo y resultado.', [ref(e.id)]);
    guardar(tx, e, cambiarCampo(e, 'ruta', a.ruta));
});
export const fijarMultiplicidad: Operacion<{
    enlace: Id;
    extremo: 'objeto' | 'refinador' | 'origen' | 'destino';
    valor: Multiplicidad | null;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace), rol = MATRIZ[e.tipo].mult;
    if (!(rol === a.extremo || rol === 'ambos' && ['origen', 'destino'].includes(a.extremo)))
        negar(tx, 'forma', 'R-MULT-1', 'La multiplicidad no corresponde a este extremo.', [ref(e.id)]);
    guardar(tx, e, cambiarCampo(e, rol === 'ambos' ? (a.extremo === 'origen' ? 'multOrigen' : 'multDestino') : 'mult', a.valor));
});
export const cambiarTipoEnlace: Operacion<{
    enlace: Id;
    tipo: TipoEnlace;
    etiquetas?: DatosEtiquetas;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace);
    if (indice(m).abanicoDeEnlace.has(e.id))
        negar(tx, 'abanico', 'R-FAN-GEO-2', 'Una rama no cambia de tipo dentro del abanico.', [ref(e.id)]);
    if (e.tipo === 'efecto' && e.escision && a.tipo !== e.tipo)
        negar(tx, 'forma', 'F-4', 'Una mitad debe conservar su par de efecto.', [ref(e.id), ref(e.escision.par)]);
    const f = MATRIZ[a.tipo];
    if (a.etiquetas && ((a.etiquetas.etiqueta !== undefined || a.etiquetas.inversa !== undefined) && f.etiquetas === 'ninguna' || a.etiquetas.inversa !== undefined && f.etiquetas !== 'doble'))
        negar(tx, 'tipo-incompatible', 'R-OPL-SE-2', 'Los datos de etiquetas no corresponden al tipo de enlace.', [ref(e.id)]);
    if (e.tipo === a.tipo) {
        let candidato = e;
        for (const k of ['etiqueta', 'inversa'] as const)
            if (a.etiquetas && a.etiquetas[k] !== undefined)
                candidato = cambiarCampo(candidato, k, a.etiquetas[k]);
        guardar(tx, e, candidato);
        return;
    }
    const ex = extremos(e), campos: Record<string, unknown> = { id: e.id, tipo: a.tipo };
    if (f.roles[0] === 'objeto') {
        campos.objeto = esProcedimental(e) ? e.objeto : a.tipo === 'resultado' || a.tipo === 'efecto' ? ex.destino : ex.origen;
        campos.proceso = esProcedimental(e) ? e.proceso : a.tipo === 'resultado' || a.tipo === 'efecto' ? ex.origen : ex.destino;
    }
    else {
        campos[f.roles[0]] = ex.origen;
        campos[f.roles[1]] = ex.destino;
    }
    const antiguos = { ...e } as unknown as Record<string, unknown>;
    const permitidos = ['etiqueta', ...(f.etiquetas === 'doble' ? ['inversa'] : [])].filter(() => f.etiquetas !== 'ninguna');
    if (f.control)
        permitidos.push('control');
    if (f.ruta)
        permitidos.push('ruta');
    if (f.mult === 'ambos')
        permitidos.push('multOrigen', 'multDestino');
    else if (f.mult !== 'ninguno')
        permitidos.push('mult');
    const porEstado = { ninguno: [], objeto: ['estado'], entradaSalida: ['entrada', 'salida'], parGeneralizacion: ['estados'], origenDestino: ['estadoOrigen', 'estadoDestino'], soloOrigen: ['estadoOrigen'], simetrico: ['estados'] } as const;
    if (MATRIZ[e.tipo].estados === f.estados)
        permitidos.push(...porEstado[f.estados]);
    for (const k of permitidos)
        if (antiguos[k] !== undefined)
            campos[k] = antiguos[k];
    for (const k of ['etiqueta', 'inversa'] as const)
        if (a.etiquetas && a.etiquetas[k] !== undefined) {
            const valor = a.etiquetas[k];
            if (valor === null || valor === undefined) delete campos[k];
            else campos[k] = valor;
        }
    const trasladados = new Set<string>();
    if (MATRIZ[e.tipo].familia === 'etiquetada' && f.familia === 'etiquetada') {
        const origen = e.tipo === 'reciproco' ? e.estados?.origen : 'estadoOrigen' in e ? e.estadoOrigen : undefined;
        const destino = e.tipo === 'reciproco' ? e.estados?.destino : e.tipo === 'etiquetado' ? e.estadoDestino : undefined;
        for (const k of ['estadoOrigen', 'estadoDestino', 'estados'])
            delete campos[k];
        if (f.estados === 'origenDestino') {
            if (origen)
                campos.estadoOrigen = origen;
            if (destino)
                campos.estadoDestino = destino;
        }
        else if (f.estados === 'soloOrigen') {
            if (origen)
                campos.estadoOrigen = origen;
        }
        else if (origen || destino)
            campos.estados = { ...(origen ? { origen } : {}), ...(destino ? { destino } : {}) };
        if (origen)
            trasladados.add(e.tipo === 'reciproco' ? 'estados' : 'estadoOrigen');
        if (destino && f.estados !== 'soloOrigen')
            trasladados.add(e.tipo === 'reciproco' ? 'estados' : 'estadoDestino');
    }
    // Un estado simple conserva su papel al cambiar entre familias procedimentales compatibles.
    if (a.tipo === 'efecto' && 'estado' in e && e.estado)
        campos[e.tipo === 'resultado' ? 'salida' : 'entrada'] = e.estado;
    if (f.estados === 'objeto' && e.tipo === 'efecto') {
        const estado = a.tipo === 'resultado' ? e.salida : e.entrada;
        if (estado)
            campos.estado = estado;
    }
    for (const [k, v] of Object.entries(antiguos))
        if (k !== 'id' && k !== 'tipo' && !Object.hasOwn(campos, k) && !trasladados.has(k) && !['objeto', 'proceso', 'origen', 'destino', 'refinable', 'refinador'].includes(k))
            tx.traza({ regla: 'R-OPD-OP-5', mensaje: `Se retiró ${k} al cambiar el tipo de enlace.`, refs: [ref(e.id)] });
    guardar(tx, e, campos as unknown as Enlace, true);
});
export const reanclarExtremo: Operacion<{
    opd: Id;
    enlace: Id;
    extremo: 'origen' | 'destino';
    hacia: ExtremoRef;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace), ex = extremos(e);
    let n = e;
    const anclar = (campo: string) => {
        n = cambiarCampo(n, campo, a.hacia.estado);
    };
    if (esProcedimental(e)) {
        const objeto = ex[a.extremo] === e.objeto;
        n = cambiarCampo(e, objeto ? 'objeto' : 'proceso', a.hacia.cosa);
        if (!objeto && a.hacia.estado)
            negar(tx, 'forma', 'R-EDIT-2', 'El proceso no tiene estado.', [ref(e.id), { tipo: 'estado', id: a.hacia.estado }]);
        if (objeto) {
            if (e.tipo === 'efecto') {
                const unico = Boolean(e.entrada) !== Boolean(e.salida);
                if (e.entrada && e.salida || a.hacia.estado && !unico)
                    negar(tx, 'referencia-ambigua', 'R-OPD-EDIT-4', 'Indica entrada y salida mediante fijarEstados antes de reanclar este efecto.', [ref(e.id), { tipo: 'cosa', id: a.hacia.cosa }, ...(a.hacia.estado ? [{ tipo: 'estado' as const, id: a.hacia.estado }] : [])]);
                if (unico)
                    anclar(e.entrada ? 'entrada' : 'salida');

            }
            else
                anclar('estado');
        }
    }
    else if ('refinable' in e) {
        n = cambiarCampo(e, a.extremo === 'origen' ? 'refinable' : 'refinador', a.hacia.cosa);
        if (e.tipo === 'generalizacion') {
            if (a.hacia.estado) {
                if (!e.estados)
                    negar(tx, 'referencia-ambigua', 'R-OPL-RF-3', 'La especialización requiere ambos estados explícitos.', [ref(e.id)]);
                n = cambiarCampo(n, 'estados', { ...e.estados, [a.extremo === 'origen' ? 'general' : 'especializacion']: a.hacia.estado });
            }
            else
                n = cambiarCampo(n, 'estados', null);
        }
        else if (a.hacia.estado)
            negar(tx, 'forma', 'R-EDIT-2', 'Esta relación estructural no ancla estados.', [ref(e.id), { tipo: 'estado', id: a.hacia.estado }]);
    }
    else {
        n = cambiarCampo(e, a.extremo, a.hacia.cosa);
        if (e.tipo === 'etiquetado')
            anclar(a.extremo === 'origen' ? 'estadoOrigen' : 'estadoDestino');
        else if (e.tipo === 'etiquetadoBidireccional') {
            if (a.extremo === 'destino' && a.hacia.estado)
                negar(tx, 'forma', 'AP-11', 'El bidireccional solo ancla origen.', [ref(e.id)]);
            if (a.extremo === 'origen')
                anclar('estadoOrigen');
        }
        else if (e.tipo === 'reciproco') {
            const estados = { ...e.estados } as Record<string, Id>;
            if (a.hacia.estado)
                estados[a.extremo] = a.hacia.estado;
            else
                delete estados[a.extremo];
            if (!estados.origen && estados.destino)
                negar(tx, 'forma', 'AP-11', 'El recíproco no admite estado solo en destino.', [ref(e.id)]);
            n = cambiarCampo(n, 'estados', estados.origen ? estados : null);
        }
        else if (a.hacia.estado)
            negar(tx, 'forma', 'R-EDIT-2', 'Este enlace no tiene estado.', [ref(e.id)]);
    }
    visible(tx, a.opd, n);
    guardar(tx, e, n, true);
});
export const distribuirEnlace: Operacion<{
    enlace: Id;
}> = (m, a) => transaccion(m, tx => {
    const e = obtener(tx, a.enlace);
    distribuirEnTx(tx, e.id, tx.m.raiz);
    mostrar(tx, e.id);
    formaDistribucionFinal(tx);
});
export const eliminarEnlaces: Operacion<{
    enlaces: readonly Id[];
}> = (m, a) => transaccion(m, tx => {
    const ids = new Set(a.enlaces), es = [...ids].map(id => obtener(tx, id));
    for (const e of es) {
        tx.quitar('enlaces', e.id);
        if (e.tipo === 'efecto' && e.escision && !ids.has(e.escision.par)) {
            const otro = obtener(tx, e.escision.par);
            tx.poner('enlaces', cambiarCampo(otro, 'escision', null));
            tx.traza({ regla: 'DR-7', mensaje: 'La mitad superviviente quedó standalone al borrar su contraparte.', refs: [ref(e.id), ref(otro.id)] });
        }
    }
    for (const f of Object.values(m.abanicos)) {
        const enlaces = f.enlaces.filter(id => !ids.has(id));
        if (enlaces.length === f.enlaces.length)
            continue;
        if (enlaces.length < 2) {
            tx.quitar('abanicos', f.id);
            tx.traza({ regla: 'R-FAN-GEO-2', mensaje: 'El abanico se disolvió al quedar con menos de dos ramas.', refs: [{ tipo: 'abanico', id: f.id }] });
        }
        else {
            const n = { ...f, enlaces };
            validarAbanicoTx(tx, n);
            tx.poner('abanicos', n);
        }
    }
    for (const e of es)
        valorHuerfano(tx, e);
});
