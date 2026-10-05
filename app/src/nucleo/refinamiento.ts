import type { Id, Modelo, TipoCosa, Enlace, Opd, OpdDescomposicion, OpdDespliegue, Ref, ModoDespliegue } from './tipos';
import { esProcedimental, extremos } from './tipos';
import type { Operacion, Tx, CodigoRechazo, Respuesta, Hecho, Traza } from './resultado';
import { transaccion } from './resultado';
import { indice, claveNombre } from './indice';
import { validarNombreCosa } from './lexico';
import { validarForma } from './forma';
import { noOfrecido, violacionesAbanico } from './matriz';
import { colocarDescomposicion, colocarDespliegue } from './colocacion';
import { proyectar, hechoDeMayorFuerza } from './proyeccion';
const ref = (id: Id): Ref => ({ tipo: 'cosa', id });
const ro = (id: Id): Ref => ({ tipo: 'opd', id });
const re = (id: Id): Ref => ({ tipo: 'enlace', id });
function negar(tx: Tx, codigo: CodigoRechazo, regla: string, mensaje: string, refs: readonly Ref[]): never { return tx.rechazar({ codigo, regla, mensaje, refs }); }
function obtenerOpd(tx: Tx, id: Id): Opd { return (Object.hasOwn(tx.m.opds, id) ? tx.m.opds[id] : undefined) ?? negar(tx, 'no-encontrado', 'producto', 'El OPD ya no existe.', [ro(id)]); }
function descomp(tx: Tx, id: Id): OpdDescomposicion { const o = obtenerOpd(tx, id); if (o.tipo !== 'descomposicion') return negar(tx, 'tipo-incompatible', 'T-076', 'Se requiere una descomposición.', [ro(id)]); return o; }
function despliegue(tx: Tx, id: Id): OpdDespliegue { const o = obtenerOpd(tx, id); if (o.tipo !== 'despliegue') return negar(tx, 'tipo-incompatible', 'T-071', 'Se requiere un despliegue.', [ro(id)]); return o; }
function formaFinal(tx: Tx): void { const v = validarForma(tx.m)[0]; if (v) negar(tx, 'forma', v.regla, v.mensaje, v.refs); }
function nombre(tx: Tx, n: string, ambiguo = false): void {
    const mal = validarNombreCosa(n); if (mal) tx.rechazar(mal);
    const previo = indice(tx.m).porClaveNombre.get(claveNombre(n))?.[0];
    if (previo) negar(tx, ambiguo ? 'referencia-ambigua' : 'unicidad-nominal', ambiguo ? 'DR-35' : 'AP-22', `**${n}** ya identifica otra cosa.`, [ref(previo)]);
}
function precondicion(tx: Tx, oid: Id, cid: Id, tipo: 'descomposicion' | 'despliegue'): Opd {
    const o = obtenerOpd(tx, oid), c = Object.hasOwn(tx.m.cosas, cid) ? tx.m.cosas[cid] : undefined;
    if (!c) negar(tx, 'no-encontrado', 'producto', 'La cosa ya no existe.', [ref(cid)]);
    if (tipo === 'descomposicion' && c.tipo !== 'proceso') negar(tx, 'descomposicion-objeto', 'R-OPL-CX-4', 'La descomposición de objeto no está disponible (DR-23).', [ref(cid)]);
    if (!Object.hasOwn(o.apariciones, cid)) negar(tx, 'no-visible', 'R-EDIT-1', 'La cosa debe aparecer en este OPD.', [ref(cid), ro(oid)]);
    for (let actual = o; actual.tipo !== 'raiz'; actual = tx.m.opds[actual.padre]!) {
        if (actual.cosa === cid) negar(tx, 'ciclo', 'R-REF-1', 'No se refina una cosa dentro de su propio árbol.', [ref(cid), ro(oid)]);
    }
    const propio = o.tipo === 'raiz' || (o.tipo === 'descomposicion' ? indice(tx.m).internoDe.get(cid) === oid : Object.values(tx.m.enlaces).some(e => e.tipo === o.modo && 'refinable' in e && e.refinable === o.cosa && 'refinador' in e && e.refinador === cid));
    if (!propio) negar(tx, 'externo-no-refinable', 'R-HIJO-5', 'Un externo no se refina desde el OPD hijo.', [ref(cid), ro(oid)]);
    if (indice(tx.m).refinamientosDe.get(cid)?.[tipo]) negar(tx, 'ya-refinado', 'T-078', 'La cosa ya tiene este refinamiento.', [ref(cid)]);
    return o;
}
function layout(tx: Tx, o: OpdDescomposicion): void { tx.poner('opds', { ...o, apariciones: colocarDescomposicion(tx.m, o) }); }

// Ensayo puro: nunca cierra DS-20 contra el borrador que ya contiene el enlace.
// Los consumidores cierran contra su original real mediante transaccion.
export function planificarDistribucion(m: Modelo, a: { readonly opd: Id; readonly enlace: Enlace }): Respuesta<Hecho> {
    let actual = m; const creados: Id[] = [], trazas: Traza[] = [], visitados = new Set<string>();
    const ponerEnlace = (e: Enlace) => { actual = { ...actual, enlaces: { ...actual.enlaces, [e.id]: e } }; };
    const siguiente = () => { const id = `e-${actual.secuencia}`; actual = { ...actual, secuencia: actual.secuencia + 1 }; creados.push(id); return id; };
    const copiar = (oid: Id, objeto: Id) => {
        const o = actual.opds[oid]; if (!o || o.tipo !== 'descomposicion' || Object.hasOwn(o.apariciones, objeto)) return;
        const nuevo = { ...o, apariciones: { ...o.apariciones, [objeto]: { x: -220, y: 64, ancho: 135, alto: 60 } } };
        actual = { ...actual, opds: { ...actual.opds, [oid]: { ...nuevo, apariciones: colocarDescomposicion(actual, nuevo) } } };
    };
    function distribuir(id: Id): void {
        const e = actual.enlaces[id]; if (!e || !esProcedimental(e)) return;
        const idx = indice(actual), oid = idx.refinamientosDe.get(e.proceso)?.descomposicion, o = oid ? actual.opds[oid] : undefined;
        if (!o || o.tipo !== 'descomposicion') return;
        const llave = `${id}:${o.id}`; if (visitados.has(llave)) return; visitados.add(llave);
        copiar(o.id, e.objeto);
        const ss = o.bandas.flat(); if (!ss.length) return;
        const evento = 'control' in e && e.control === 'e' && actual.cosas[e.objeto]?.afiliacion === 'sistemica';
        const fid = idx.abanicoDeEnlace.get(id), fan = fid ? actual.abanicos[fid] : undefined;
        const completo = e.tipo === 'efecto' && e.entrada !== undefined && e.salida !== undefined;
        const mueve = evento || e.tipo === 'consumo' || e.tipo === 'resultado' || e.tipo === 'efecto' && (e.entrada !== undefined || e.salida !== undefined);
        if (!mueve) return;
        // Las ramas con común P viajan juntas; común O con otros procesos no se arrastra.
        const grupo = fan ? fan.enlaces.filter(r => { const x = actual.enlaces[r]; return x && esProcedimental(x) && x.proceso === e.proceso; }) : [id];
        for (const rid of grupo) {
            const rama = actual.enlaces[rid]!; if (!esProcedimental(rama)) continue;
            const ts3 = rama.tipo === 'efecto' && rama.entrada !== undefined && rama.salida !== undefined;
            if (ts3 && ss.length >= 2 && !rama.control && !fan) {
                const salida = siguiente(), { entrada, salida: estadoSalida, ...resto } = rama;
                ponerEnlace({ ...resto, id: rid, proceso: ss[0]!, entrada: entrada!, escision: { par: salida, mitad: 'entrada' } });
                ponerEnlace({ ...resto, id: salida, proceso: ss.at(-1)!, salida: estadoSalida!, escision: { par: rid, mitad: 'salida' } });
                trazas.push({ regla: 'R-ESCIND-1', mensaje: `El cambio de **${actual.cosas[rama.objeto]!.nombre}** quedó escindido entre el primer y último subproceso.`, refs: [re(rid), re(salida), ro(o.id)] });
                distribuir(rid); distribuir(salida);
            } else {
                const entrada = evento || completo || rama.tipo !== 'resultado' && !(rama.tipo === 'efecto' && !rama.entrada && rama.salida);
                const destino = entrada ? ss[0]! : ss.at(-1)!;
                ponerEnlace({ ...rama, proceso: destino });
                trazas.push({ regla: ts3 && (rama.control || fan) ? 'DS-4' : 'R-DIST-1', mensaje: ts3 && (rama.control || fan) ? `El cambio de **${actual.cosas[rama.objeto]!.nombre}** quedó entero en *${actual.cosas[destino]!.nombre}*; para escindirlo, quita antes el control o abanico.` : `Enlace migrado a *${actual.cosas[destino]!.nombre}*.`, refs: [re(rid), ref(destino), ro(o.id)] });
                distribuir(rid);
            }
        }
    }
    distribuir(a.enlace.id);
    for (const e of Object.values(actual.enlaces)) {
        if (m.enlaces[e.id] === e) continue;
        const fid = indice(actual).abanicoDeEnlace.get(e.id), fan = fid ? actual.abanicos[fid] : undefined, nf = noOfrecido(actual, e, fan);
        if (nf) return { ok: false, rechazo: { codigo: 'no-ofrecido', regla: nf.regla, mensaje: nf.motivo, refs: [re(e.id)] } };
        if (fan) { const mal = violacionesAbanico(actual, fan)[0]; if (mal) return { ok: false, rechazo: { codigo: 'abanico', regla: mal.regla, mensaje: mal.mensaje, refs: mal.refs } }; }
    }
    return { ok: true, valor: { modelo: actual, creados }, trazas };
}
export function distribuirEnTx(tx: Tx, id: Id, opd: Id): void {
    const previo = tx.m, e = previo.enlaces[id]; if (!e) return negar(tx, 'no-encontrado', 'producto', 'El enlace ya no existe.', [re(id)]);
    const r = planificarDistribucion(previo, { opd, enlace: e }); if (!r.ok) return tx.rechazar(r.rechazo);
    for (const esperado of r.valor.creados) { const id = tx.nuevoId('e'); if (id !== esperado) throw Error('Secuencia de ensayo inconsistente'); }
    for (const col of ['enlaces', 'opds'] as const) for (const [id, dato] of Object.entries(r.valor.modelo[col])) if (previo[col][id] !== dato) tx.poner(col, dato);
    r.trazas.forEach(t => tx.traza(t));
}
export function distribuirContornoTx(tx: Tx, oid: Id): void {
    const o = descomp(tx, oid), ids = Object.values(tx.m.enlaces).filter(e => esProcedimental(e) && e.proceso === o.cosa).map(e => e.id);
    for (const id of ids) distribuirEnTx(tx, id, oid);
}
function agregarEnTx(tx: Tx, a: { opd: Id; bandas: readonly (readonly string[])[]; posicion: 'final' | { antesDeBanda: number } | { enBanda: number } }): void {
    const o = descomp(tx, a.opd), antes = o.bandas.flat().length, bandas = o.bandas.map(b => [...b]);
    if (a.bandas.some(b => !b.length)) negar(tx, 'forma', 'F-8', 'Una banda no puede estar vacía.', [ro(o.id)]);
    const destino = a.posicion === 'final' ? bandas.length : 'antesDeBanda' in a.posicion ? a.posicion.antesDeBanda : a.posicion.enBanda;
    if (!Number.isInteger(destino) || destino < 0 || destino > bandas.length || a.posicion !== 'final' && 'enBanda' in a.posicion && destino === bandas.length) negar(tx, 'forma', 'F-8', 'La banda de inserción no existe.', [ro(o.id)]);
    const nuevas: Id[][] = [], apps = { ...o.apariciones };
    for (const b of a.bandas) {
        const ids: Id[] = [];
        for (const n of b) {
            const existente = indice(tx.m).porClaveNombre.get(claveNombre(n))?.[0];
            if (existente && o.bandas.flat().includes(existente)) { negar(tx, 'ya-existe', 'F-8', 'El subproceso ya pertenece a esta descomposición.', [ref(existente)]); }
            nombre(tx, n, true); const id = tx.nuevoId('p'), afiliacion = tx.m.cosas[o.cosa]!.afiliacion;
            tx.poner('cosas', { id, tipo: 'proceso', nombre: n, esencia: 'informacional', afiliacion }); ids.push(id); apps[id] = { x: 0, y: 0, ancho: 135, alto: 60 };
            if (afiliacion === 'ambiental') tx.traza({ regla: 'R-OBJ-6', mensaje: `**${n}** heredó la afiliación ambiental del contenedor.`, refs: [ref(id), ref(o.cosa)] });
        }
        nuevas.push(ids);
    }
    if (a.posicion !== 'final' && 'enBanda' in a.posicion) {
        bandas[destino]!.push(...(nuevas.shift() ?? [])); bandas.splice(destino + 1, 0, ...nuevas);
    } else bandas.splice(destino, 0, ...nuevas);
    layout(tx, { ...o, bandas, apariciones: apps });
    if (antes === 0 && bandas.length) distribuirContornoTx(tx, o.id);
}
export const descomponer: Operacion<{ opd: Id; proceso: Id; bandas?: readonly (readonly string[])[] }> = (m, a) => transaccion(m, tx => {
    precondicion(tx, a.opd, a.proceso, 'descomposicion'); const id = tx.nuevoId('opd');
    const conectados = new Set<Id>(); for (const e of Object.values(m.enlaces)) { const ex = extremos(e); if (ex.origen === a.proceso) conectados.add(ex.destino); if (ex.destino === a.proceso) conectados.add(ex.origen); }
    conectados.delete(a.proceso); const apariciones: OpdDescomposicion['apariciones'] = { [a.proceso]: { x: 0, y: 0, ancho: 420, alto: 188 }, ...Object.fromEntries([...conectados].map(c => [c, m.opds[a.opd]!.apariciones[c] ?? { x: 0, y: 0, ancho: 135, alto: 60 }])) };
    layout(tx, { id, tipo: 'descomposicion', padre: a.opd, cosa: a.proceso, orden: indice(m).hijosDe.get(a.opd)?.length ?? 0, bandas: [], objetosInternos: [], apariciones });
    if (a.bandas?.length) agregarEnTx(tx, { opd: id, bandas: a.bandas, posicion: 'final' }); formaFinal(tx);
});
export const agregarSubprocesos: Operacion<{ opd: Id; bandas: readonly (readonly string[])[]; posicion: 'final' | { antesDeBanda: number } | { enBanda: number } }> = (m, a) => transaccion(m, tx => { agregarEnTx(tx, a); formaFinal(tx); });
function particion(tx: Tx, oid: Id, bandas: readonly (readonly Id[])[]): void {
    const o = descomp(tx, oid), actual = o.bandas.flat(), nuevos = bandas.flat();
    if (bandas.some(b => !b.length) || nuevos.length !== actual.length || new Set(nuevos).size !== nuevos.length || nuevos.some(id => !actual.includes(id))) negar(tx, 'forma', 'F-8', 'Las bandas deben particionar todos los subprocesos exactamente una vez.', [ro(oid)]);
    layout(tx, { ...o, bandas }); formaFinal(tx);
}
export const fijarBandas: Operacion<{ opd: Id; bandas: readonly (readonly Id[])[] }> = (m, a) => transaccion(m, tx => particion(tx, a.opd, a.bandas));
export const moverSubproceso: Operacion<{ opd: Id; proceso: Id; destino: { banda: number } | { nuevaBandaAntesDe: number } }> = (m, a) => transaccion(m, tx => {
    const o = descomp(tx, a.opd), bandas = o.bandas.map(b => [...b]), origen = bandas.findIndex(b => b.includes(a.proceso));
    if (origen < 0) negar(tx, 'no-encontrado', 'T-082', 'El proceso no es un subproceso de este OPD.', [ref(a.proceso), ro(o.id)]);
    const k = 'banda' in a.destino ? a.destino.banda : a.destino.nuevaBandaAntesDe;
    if (!Number.isInteger(k) || k < 0 || k > bandas.length || 'banda' in a.destino && k === bandas.length) negar(tx, 'forma', 'F-8', 'La banda destino no existe.', [ro(o.id)]);
    bandas[origen] = bandas[origen]!.filter(id => id !== a.proceso);
    if ('banda' in a.destino) bandas[k]!.push(a.proceso); else bandas.splice(k, 0, [a.proceso]);
    particion(tx, o.id, bandas.filter(b => b.length));
}, { permiteErroresNuevos: true });
function refinadoresEnTx(tx: Tx, a: { opd: Id; nombres: readonly string[]; tipo?: TipoCosa }): void {
    const o = despliegue(tx, a.opd), c = tx.m.cosas[o.cosa]!, apps = { ...o.apariciones };
    for (const n of a.nombres) {
        nombre(tx, n); const tipo = o.modo === 'exhibicion' ? a.tipo ?? 'objeto' : c.tipo;
        if (o.modo !== 'exhibicion' && a.tipo && a.tipo !== c.tipo) negar(tx, 'tipo-incompatible', 'R-STRF-1', 'Los refinadores deben conservar la perseverancia.', [ref(c.id)]);
        const id = tx.nuevoId(tipo === 'objeto' ? 'o' : 'p'), afiliacion = o.modo === 'exhibicion' ? c.afiliacion : 'sistemica';
        const dato = { id, nombre: n, esencia: 'informacional' as const, afiliacion }; tx.poner('cosas', tipo === 'objeto' ? { ...dato, tipo, estados: [] } : { ...dato, tipo });
        const eid = tx.nuevoId('e'); tx.poner('enlaces', { id: eid, tipo: o.modo, refinable: c.id, refinador: id }); apps[id] = { x: 0, y: 180, ancho: 135, alto: 60 };
        if (afiliacion === 'ambiental') tx.traza({ regla: 'R-OBJ-6', mensaje: `**${n}** heredó la afiliación ambiental.`, refs: [ref(id), ref(c.id)] });
    }
    const nuevo = { ...o, apariciones: apps }; tx.poner('opds', { ...nuevo, apariciones: colocarDespliegue(tx.m, nuevo) });
}
export const desplegar: Operacion<{ opd: Id; cosa: Id; modo: ModoDespliegue; refinadores?: readonly string[] }> = (m, a) => transaccion(m, tx => {
    precondicion(tx, a.opd, a.cosa, 'despliegue');
    if (!['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'].includes(a.modo)) negar(tx, 'tipo-incompatible', 'R-REF-MEC-1', 'Se requiere una relación fundamental.', [ref(a.cosa)]);
    const id = tx.nuevoId('opd'), ids = Object.values(m.enlaces).filter(e => e.tipo === a.modo && 'refinable' in e && e.refinable === a.cosa).map(e => 'refinador' in e ? e.refinador : '');
    const nuevo: OpdDespliegue = { id, tipo: 'despliegue', padre: a.opd, cosa: a.cosa, modo: a.modo, orden: indice(m).hijosDe.get(a.opd)?.length ?? 0, apariciones: Object.fromEntries([a.cosa, ...ids].map(c => [c, m.opds[a.opd]!.apariciones[c] ?? { x: 0, y: 0, ancho: 135, alto: 60 }])) };
    tx.poner('opds', { ...nuevo, apariciones: colocarDespliegue(tx.m, nuevo) });
    if (a.refinadores?.length) refinadoresEnTx(tx, { opd: id, nombres: a.refinadores }); formaFinal(tx);
});
export const agregarRefinadores: Operacion<{ opd: Id; nombres: readonly string[]; tipo?: TipoCosa }> = (m, a) => transaccion(m, tx => { refinadoresEnTx(tx, a); formaFinal(tx); });
export const eliminarRefinamiento: Operacion<{ opd: Id }> = (m, a) => transaccion(m, tx => {
    const o = obtenerOpd(tx, a.opd); if (o.tipo === 'raiz') negar(tx, 'es-contenedor', 'R-REF-3', 'La raíz no es un refinamiento.', [ro(o.id)]);
    if (indice(m).hijosDe.get(o.id)?.length) negar(tx, 'refinamiento-no-hoja', 'R-REF-3', 'Elimina primero los refinamientos hijos.', [ro(o.id)]);
    const internos = new Set(o.tipo === 'descomposicion' ? [...o.bandas.flat(), ...o.objetosInternos] : Object.keys(o.apariciones).filter(id => id !== o.cosa && indice(m).aparicionesDe.get(id)?.length === 1));
    const materializados = new Set<Id>();
    if (o.tipo === 'descomposicion') {
        const vista = proyectar(m, o.padre);
        for (const v of vista.enlaces) {
            if (!v.abstraido || !v.hechos.some(id => { const e = m.enlaces[id]!; const ex = extremos(e); return internos.has(ex.origen) || internos.has(ex.destino); })) continue;
            if (vista.conflictos.some(c => c.codigo === 'precedencia-invalida' && c.refs.some(r => r.tipo === 'enlace' && v.hechos.includes(r.id)))) { tx.traza({ regla: 'AP-30', mensaje: 'La colisión de precedencia no se materializó.', refs: v.hechos.map(re) }); continue; }
            let e = v.enlace; const ex = extremos(e); if (internos.has(ex.origen) || internos.has(ex.destino)) continue;
            if (esProcedimental(e)) {
                const originales = v.hechos.map(id => m.enlaces[id]!).filter(esProcedimental);
                if (!originales.length) negar(tx, 'forma', 'DS-16', 'El hecho procedimental abstraído requiere originales.', [ro(o.padre)]);
                e = { ...e, id: hechoDeMayorFuerza(originales).id };
            }
            const limpio = e.tipo === 'efecto' && e.escision ? (() => { const { escision, ...resto } = e; return resto; })() : e;
            tx.poner('enlaces', limpio); materializados.add(e.id); tx.traza({ regla: 'DS-16', mensaje: 'Se materializó en el padre el hecho abstraído.', refs: [re(e.id), ref(o.cosa), ro(o.padre)] });
        }
    }
    const estados = new Set([...internos].flatMap(id => { const c = m.cosas[id]; return c?.tipo === 'objeto' ? c.estados.map(s => s.id) : []; }));
    for (const e of Object.values(m.enlaces)) {
        if (materializados.has(e.id)) continue;
        const ex = extremos(e); if (internos.has(ex.origen) || internos.has(ex.destino)) { tx.quitar('enlaces', e.id); tx.traza({ regla: 'T-080', mensaje: 'El enlace interno se eliminó con el refinamiento.', refs: [re(e.id)] }); }
    }
    // Un rasgo externo persiste; su valor deja de ser atributo al perder la última exhibición.
    for (const e of Object.values(m.enlaces)) {
        if (e.tipo !== 'exhibicion' || Object.hasOwn(tx.m.enlaces, e.id)) continue;
        const c = tx.m.cosas[e.refinador];
        if (c?.tipo !== 'objeto' || internos.has(c.id) || c.valor === undefined || Object.values(tx.m.enlaces).some(x => x.tipo === 'exhibicion' && x.refinador === c.id)) continue;
        const { valor, ...resto } = c; tx.poner('cosas', resto);
        tx.traza({ regla: 'F-13', mensaje: `El valor ${valor} de **${c.nombre}** se quitó: ya no es atributo.`, refs: [ref(c.id), re(e.id)] });
    }
    for (const id of internos) { tx.quitar('cosas', id); tx.traza({ regla: 'T-080', mensaje: 'La cosa interna se eliminó con el refinamiento.', refs: [ref(id)] }); }
    tx.quitar('opds', o.id);
    for (const actual of Object.values(tx.m.opds)) {
        let nuevo = actual;
        const apariciones = Object.fromEntries(Object.entries(actual.apariciones).filter(([id]) => !internos.has(id)).map(([id, app]) => { if (!app.ocultos?.some(s => estados.has(s))) return [id, app]; const { ocultos, ...resto } = app; const quedan = ocultos.filter(s => !estados.has(s)); return [id, quedan.length ? { ...resto, ocultos: quedan } : resto]; }));
        if (Object.keys(apariciones).length !== Object.keys(actual.apariciones).length) nuevo = { ...nuevo, apariciones };
        if (nuevo.tipo !== 'raiz' && nuevo.padre === o.padre && nuevo.orden > o.orden) nuevo = { ...nuevo, orden: nuevo.orden - 1 };
        if (nuevo !== actual) tx.poner('opds', nuevo);
    }
    for (const f of Object.values(tx.m.abanicos)) {
        const enlaces = f.enlaces.filter(id => Object.hasOwn(tx.m.enlaces, id));
        if (enlaces.length < 2) { tx.quitar('abanicos', f.id); tx.traza({ regla: 'R-FAN-GEO-2', mensaje: 'Se disolvió el abanico residual.', refs: [{ tipo: 'abanico', id: f.id }] }); }
        else if (enlaces.length !== f.enlaces.length) tx.poner('abanicos', { ...f, enlaces });
    }
    formaFinal(tx);
});
