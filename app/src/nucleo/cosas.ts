import type { Id, Modelo, Cosa, TipoCosa, Esencia, Afiliacion, Duracion, RelacionIncompleta, Opd, Ref, Aparicion } from './tipos';
import { esProcedimental } from './tipos';
import type { Operacion, Tx, CodigoRechazo } from './resultado';
import { transaccion } from './resultado';
import { indice, claveNombre } from './indice';
import { validarNombreCosa } from './lexico';
import { violacionesForma } from './matriz';
import { validarForma } from './forma';
import { colocarDescomposicion } from './colocacion';
import { distribuirContornoTx } from './refinamiento';

const ref = (id: Id): Ref => ({ tipo: 'cosa', id });
function negar(tx: Tx, codigo: CodigoRechazo, regla: string, mensaje: string, refs: readonly Ref[]): never {
    return tx.rechazar({ codigo, regla, mensaje, refs });
}
function cosa(tx: Tx, id: Id): Cosa {
    const c = Object.hasOwn(tx.m.cosas, id) ? tx.m.cosas[id] : undefined;
    return c ?? negar(tx, 'no-encontrado', 'producto', 'La cosa ya no existe.', [ref(id)]);
}
function opd(tx: Tx, id: Id): Opd {
    const o = Object.hasOwn(tx.m.opds, id) ? tx.m.opds[id] : undefined;
    return o ?? negar(tx, 'no-encontrado', 'producto', 'El OPD ya no existe.', [{ tipo: 'opd', id }]);
}
function nombre(tx: Tx, n: string, refs: readonly Ref[], excluir?: Id) {
    const r = validarNombreCosa(n);
    if (r) tx.rechazar({ ...r, refs });
    const otro = indice(tx.m).porClaveNombre.get(claveNombre(n))?.find(id => id !== excluir);
    if (otro) tx.rechazar({ codigo: 'unicidad-nominal', regla: 'AP-22', mensaje: `**${tx.m.cosas[otro]!.nombre}** ya existe.`, accion: 'Trae esa misma cosa o escribe otro nombre.', refs: [ref(otro), ...refs] });
}
type SinCampo<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
function sinCampo<T extends object, K extends keyof T>(x: T, k: K): SinCampo<T, K> {
    const copia = { ...x }; delete copia[k]; return copia as unknown as SinCampo<T, K>;
}
function coordenadas(tx: Tx, x: number, y: number, refs: readonly Ref[]) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) negar(tx, 'forma', 'F-12', 'La posición debe ser finita.', refs);
}
function dentro(p: { x: number; y: number }, caja: Aparicion): boolean {
    return p.x >= caja.x && p.x <= caja.x + caja.ancho && p.y >= caja.y && p.y <= caja.y + caja.alto;
}
function confinar(a: Aparicion, contenedor: Aparicion): Aparicion {
    return { ...a, x: Math.max(contenedor.x, Math.min(a.x, contenedor.x + contenedor.ancho - a.ancho)), y: Math.max(contenedor.y, Math.min(a.y, contenedor.y + contenedor.alto - a.alto)) };
}
function externo(tx: Tx, a: Aparicion, contenedor: Aparicion, id: Id, o: Id): Aparicion {
    if (a.x + a.ancho <= contenedor.x || a.x >= contenedor.x + contenedor.ancho || a.y + a.alto <= contenedor.y || a.y >= contenedor.y + contenedor.alto) return a;
    const opciones = [
        { ...a, x: contenedor.x - a.ancho - 24 }, { ...a, x: contenedor.x + contenedor.ancho + 24 },
        { ...a, y: contenedor.y - a.alto - 24 }, { ...a, y: contenedor.y + contenedor.alto + 24 },
    ];
    opciones.sort((p, q) => Math.abs(p.x - a.x) + Math.abs(p.y - a.y) - Math.abs(q.x - a.x) - Math.abs(q.y - a.y));
    tx.traza({ regla: 'T-081', mensaje: `**${tx.m.cosas[id]!.nombre}** rebotó fuera del contenedor: es externo.`, refs: [ref(id), { tipo: 'opd', id: o }] });
    return opciones[0]!;
}
function aparicion(tx: Tx, o: Opd, id: Id): Aparicion {
    cosa(tx, id);
    if (!Object.hasOwn(o.apariciones, id)) negar(tx, 'no-visible', 'R-VIS-APP-1', 'La cosa no aparece en este OPD.', [ref(id), { tipo: 'opd', id: o.id }]);
    return o.apariciones[id]!;
}
function formaCajas(tx: Tx, id: Id) {
    const v = validarForma(tx.m).find(v => v.regla === 'F-12' && v.refs.some(r => r.tipo === 'opd' && r.id === id));
    if (v) negar(tx, 'forma', v.regla, v.mensaje, v.refs);
}
export const crearCosa: Operacion<{
    opd: Id;
    tipo: TipoCosa;
    nombre: string;
    x: number;
    y: number;
    banda?: {
        indice: number;
        paralelo: boolean;
    };
    alcance?: 'interno' | 'externo';
}> = (m, a) => transaccion(m, tx => {
    const o = opd(tx, a.opd);
    nombre(tx, a.nombre, [{ tipo: 'opd', id: o.id }]);
    coordenadas(tx, a.x, a.y, [{ tipo: 'opd', id: o.id }]);
    const contenedor = o.tipo === 'descomposicion' ? o.apariciones[o.cosa]! : undefined;
    const interno = o.tipo === 'descomposicion' && (a.alcance === 'interno' || a.alcance === undefined && dentro(a, contenedor!));
    if (interno && a.tipo === 'proceso' && o.tipo === 'descomposicion') {
        if (a.banda && (!Number.isInteger(a.banda.indice) || a.banda.indice < 0 || a.banda.indice > o.bandas.length)) negar(tx, 'forma', 'F-8', 'La banda está fuera de la descomposición.', [{ tipo: 'opd', id: o.id }]);

    }
    const id = tx.nuevoId(a.tipo === 'objeto' ? 'o' : 'p');
    const afiliacion = interno && o.tipo === 'descomposicion' ? m.cosas[o.cosa]!.afiliacion : 'sistemica';
    const base = { id, nombre: a.nombre, esencia: 'informacional' as const, afiliacion };
    tx.poner('cosas', a.tipo === 'objeto' ? { ...base, tipo: 'objeto', estados: [] } : { ...base, tipo: 'proceso' });
    const app = { x: Math.round(a.x), y: Math.round(a.y), ancho: 135, alto: 60 };
    if (interno && o.tipo === 'descomposicion') {
        const bandas = o.bandas.map(b => [...b]), objetosInternos = [...o.objetosInternos];
        if (a.tipo === 'objeto') objetosInternos.push(id);
        else if (a.banda?.paralelo && bandas[a.banda.indice]) bandas[a.banda.indice]!.push(id);
        else bandas.splice(a.banda?.indice ?? bandas.length, 0, [id]);
        const nuevo = { ...o, bandas, objetosInternos, apariciones: { ...o.apariciones, [id]: app } };
        tx.poner('opds', { ...nuevo, apariciones: colocarDescomposicion(tx.m, nuevo) });
        if (a.tipo === 'proceso' && o.bandas.length === 0) distribuirContornoTx(tx, o.id);
        if (afiliacion === 'ambiental') tx.traza({ regla: 'R-OBJ-6', mensaje: `**${a.nombre}** heredó la afiliación ambiental del contenedor.`, refs: [ref(id), ref(o.cosa)] });
    } else tx.poner('opds', { ...o, apariciones: { ...o.apariciones, [id]: contenedor ? externo(tx, app, contenedor, id, o.id) : app } });
    formaCajas(tx, o.id);
});
export const renombrarCosa: Operacion<{
    cosa: Id;
    nombre: string;
}> = (m, a) => transaccion(m, tx => { const c = cosa(tx, a.cosa); nombre(tx, a.nombre, [ref(c.id)], c.id); tx.poner('cosas', { ...c, nombre: a.nombre }); });
export const cambiarTipoCosa: Operacion<{
    cosa: Id;
}> = (m, a) => transaccion(m, tx => {
    const c = cosa(tx, a.cosa), rs = indice(m).refinamientosDe.get(c.id);
    const impedimentos: string[] = [], refs: Ref[] = [ref(c.id)];
    if (rs) { impedimentos.push('refinamiento'); refs.push(...Object.values(rs).map(id => ({ tipo: 'opd' as const, id }))); }
    if (c.tipo === 'objeto') {
        if (c.estados.length) { impedimentos.push(`estados: ${c.estados.map(s => s.nombre).join(', ')}`); refs.push(...c.estados.map(s => ({ tipo: 'estado' as const, id: s.id }))); }
        if (c.valor !== undefined) impedimentos.push(`valor puntual: ${c.valor}`);
    } else if (c.duracion !== undefined) impedimentos.push('duración');
    if (impedimentos.length) negar(tx, 'tipo-incompatible', 'T-063', `**${c.nombre}** conserva ${impedimentos.join('; ')}. Retíralos explícitamente antes de cambiar el tipo.`, refs);
    if (c.tipo === 'objeto') {
        const { estados, porDefecto, current, valor, ...base } = c;
        void estados; void porDefecto; void current; void valor;
        tx.poner('cosas', { ...base, tipo: 'proceso' });
    } else {
        const { duracion, ...base } = c; void duracion;
        tx.poner('cosas', { ...base, tipo: 'objeto', estados: [] });
    }
    for (const id of indice(m).enlacesDeCosa.get(c.id) ?? []) {
        const v = violacionesForma(tx.m, tx.m.enlaces[id]!)[0];
        if (v) negar(tx, 'tipo-incompatible', v.regla, v.mensaje, [ref(c.id), ...v.refs]);
    }
    const v = validarForma(tx.m).find(v => v.refs.some(r => r.tipo === 'cosa' && r.id === c.id));
    if (v) negar(tx, 'tipo-incompatible', v.regla, v.mensaje, v.refs);
});
export const fijarEsencia: Operacion<{
    cosa: Id;
    esencia: Esencia;
}> = (m, a) => transaccion(m, tx => tx.poner('cosas', { ...cosa(tx, a.cosa), esencia: a.esencia }));
export const fijarAfiliacion: Operacion<{
    cosa: Id;
    afiliacion: Afiliacion;
}> = (m, a) => transaccion(m, tx => {
    const raiz = cosa(tx, a.cosa), pendientes = [raiz.id], vistos = new Set<Id>();
    const rasgos = new Map<Id, Id[]>();
    if (a.afiliacion === 'ambiental') for (const e of Object.values(m.enlaces)) if (e.tipo === 'exhibicion') rasgos.set(e.refinable, [...(rasgos.get(e.refinable) ?? []), e.refinador]);
    while (pendientes.length) {
        const id = pendientes.pop()!; if (vistos.has(id)) continue; vistos.add(id);
        const c = cosa(tx, id);
        tx.poner('cosas', { ...c, afiliacion: a.afiliacion });
        if (a.afiliacion === 'ambiental' && c.afiliacion !== 'ambiental') tx.traza({ regla: 'R-OPD-STR-13', mensaje: `**${c.nombre}** pasó a ambiental por la cadena de exhibición.`, refs: [ref(id)] });
        pendientes.push(...(rasgos.get(id) ?? []));
    }
});
export const fijarGenero: Operacion<{
    cosa: Id;
    genero: 'm' | 'f';
}> = (m, a) => transaccion(m, tx => { const c = cosa(tx, a.cosa); tx.poner('cosas', a.genero === 'f' ? { ...c, genero: 'f' } : sinCampo(c, 'genero')); });
export const fijarDescripcion: Operacion<{
    cosa: Id;
    texto: string | null;
}> = (m, a) => transaccion(m, tx => { const c = cosa(tx, a.cosa); tx.poner('cosas', a.texto === null ? sinCampo(c, 'descripcion') : { ...c, descripcion: a.texto }); });
export const fijarValor: Operacion<{
    objeto: Id;
    valor: string | null;
}> = (m, a) => transaccion(m, tx => {
    const c = cosa(tx, a.objeto);
    if (c.tipo !== 'objeto') negar(tx, 'tipo-incompatible', 'T-020', 'Solo un atributo objeto tiene valor.', [ref(c.id)]);
    if (a.valor !== null) {
        if (!Object.values(m.enlaces).some(e => e.tipo === 'exhibicion' && e.refinador === c.id)) negar(tx, 'tipo-incompatible', 'F-13', `**${c.nombre}** no es atributo.`, [ref(c.id)]);
        if (!/^(?:[A-Za-zÁÉÍÓÚÑÜáéíóúñü][A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9_-]*|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?)$/.test(a.valor)) negar(tx, 'lexico', 'R-§18-LEX-1', 'El valor no cumple nombre_de_valor.', [ref(c.id)]);
    }
    tx.poner('cosas', a.valor === null ? sinCampo(c, 'valor') : { ...c, valor: a.valor });
});
export const fijarDuracion: Operacion<{
    proceso: Id;
    duracion: Duracion | null;
}> = (m, a) => transaccion(m, tx => {
    const c = cosa(tx, a.proceso);
    if (c.tipo !== 'proceso') negar(tx, 'tipo-incompatible', 'T-021', 'La duración corresponde a un proceso.', [ref(c.id)]);
    if (a.duracion === null) { tx.poner('cosas', sinCampo(c, 'duracion')); return; }
    const d = { ...a.duracion };
    tx.poner('cosas', { ...c, duracion: d });
    const v = validarForma(tx.m).find(v => v.regla === 'F-10' && v.refs.some(r => r.id === c.id));
    if (v || (d.unidad !== undefined && !['ms', 'sec', 'min', 'hour', 'day', 'week', 'month', 'year'].includes(d.unidad))) negar(tx, 'duracion-invalida', 'F-10', v?.mensaje ?? 'La unidad de duración no es canónica.', [ref(c.id)]);
});
export const fijarIncompleta: Operacion<{
    cosa: Id;
    relacion: RelacionIncompleta;
    activa: boolean;
}> = (m, a) => transaccion(m, tx => {
    const c = cosa(tx, a.cosa);
    if (!['agregacion', 'exhibicion', 'generalizacion'].includes(a.relacion)) negar(tx, 'tipo-incompatible', 'T-034', 'La clasificación no admite colección incompleta.', [ref(c.id)]);
    const relaciones = new Set(c.incompleta ?? []); if (a.activa) relaciones.add(a.relacion); else relaciones.delete(a.relacion);
    tx.poner('cosas', relaciones.size ? { ...c, incompleta: [...relaciones] } : sinCampo(c, 'incompleta'));
});
export const traerCosa: Operacion<{
    cosa: Id;
    opd: Id;
    x: number;
    y: number;
}> = (m, a) => transaccion(m, tx => {
    const c = cosa(tx, a.cosa), o = opd(tx, a.opd);
    if (Object.hasOwn(o.apariciones, c.id)) negar(tx, 'ya-aparece', 'R-VIS-APP-1', `**${c.nombre}** ya aparece en este OPD.`, [ref(c.id), { tipo: 'opd', id: o.id }]);
    const dueño = indice(m).internoDe.get(c.id);
    if (dueño && dueño !== o.id) {
        let p: Opd = o;
        while (p.tipo !== 'raiz' && p.id !== dueño) p = m.opds[p.padre]!;
        if (p.id !== dueño) negar(tx, 'es-interno', 'A3.3', `**${c.nombre}** es interno de otra descomposición.`, [ref(c.id), { tipo: 'opd', id: dueño }]);
    }
    coordenadas(tx, a.x, a.y, [ref(c.id)]);
    let app: Aparicion = { x: Math.round(a.x), y: Math.round(a.y), ancho: 135, alto: 60 };
    if (o.tipo === 'descomposicion') app = externo(tx, app, o.apariciones[o.cosa]!, c.id, o.id);
    tx.poner('opds', { ...o, apariciones: { ...o.apariciones, [c.id]: app } });
    formaCajas(tx, o.id);
});
export const moverApariciones: Operacion<{
    opd: Id;
    mover: readonly {
        cosa: Id;
        x: number;
        y: number;
    }[];
}> = (m, a) => transaccion(m, tx => {
    const o = opd(tx, a.opd), movimientos = new Map(a.mover.map(p => [p.cosa, p]));
    if (!movimientos.size) negar(tx, 'forma', 'producto', 'El movimiento requiere al menos una aparición.', [{ tipo: 'opd', id: o.id }]);
    for (const p of movimientos.values()) { aparicion(tx, o, p.cosa); coordenadas(tx, p.x, p.y, [ref(p.cosa)]); }
    const cajas = { ...o.apariciones };
    if (o.tipo === 'descomposicion' && movimientos.has(o.cosa)) {
        const p = movimientos.get(o.cosa)!, anterior = cajas[o.cosa]!, x = Math.round(p.x), y = Math.round(p.y);
        const dx = x - anterior.x, dy = y - anterior.y;
        cajas[o.cosa] = { ...anterior, x, y };
        for (const id of [...o.bandas.flat(), ...o.objetosInternos]) { const app = cajas[id]!; cajas[id] = { ...app, x: app.x + dx, y: app.y + dy }; }
    }
    for (const p of movimientos.values()) {
        if (o.tipo === 'descomposicion' && p.cosa === o.cosa) continue;
        const previo = cajas[p.cosa]!;
        let app = { ...previo, x: Math.round(p.x), y: Math.round(p.y) };
        if (o.tipo === 'descomposicion') {
            const subproceso = o.bandas.some(b => b.includes(p.cosa)), interno = subproceso || o.objetosInternos.includes(p.cosa);
            if (subproceso) app = { ...app, y: previo.y };
            app = interno ? confinar(app, cajas[o.cosa]!) : externo(tx, app, cajas[o.cosa]!, p.cosa, o.id);
        }
        cajas[p.cosa] = app;
    }
    if (o.tipo === 'descomposicion' && movimientos.has(o.cosa)) {
        const internos = new Set([o.cosa, ...o.bandas.flat(), ...o.objetosInternos]);
        for (const id of Object.keys(cajas)) if (!internos.has(id)) cajas[id] = externo(tx, cajas[id]!, cajas[o.cosa]!, id, o.id);
    }
    tx.poner('opds', { ...o, apariciones: cajas });
    formaCajas(tx, o.id);
});
export const redimensionar: Operacion<{
    opd: Id;
    cosa: Id;
    ancho: number;
    alto: number;
}> = (m, a) => transaccion(m, tx => {
    const o = opd(tx, a.opd), app = aparicion(tx, o, a.cosa);
    if (!Number.isInteger(a.ancho) || !Number.isInteger(a.alto) || a.ancho < 20 || a.alto < 20) negar(tx, 'forma', 'F-12', 'La caja requiere enteros finitos y tamaños ≥20.', [ref(a.cosa), { tipo: 'opd', id: o.id }]);
    tx.poner('opds', { ...o, apariciones: { ...o.apariciones, [a.cosa]: { ...app, ancho: a.ancho, alto: a.alto } } });
});
export const quitarDeOpd: Operacion<{
    opd: Id;
    cosas: readonly Id[];
}> = (m, a) => transaccion(m, tx => {
    const o = opd(tx, a.opd), ids = new Set(a.cosas);
    for (const id of ids) {
        aparicion(tx, o, id);
        if (o.tipo !== 'raiz' && o.cosa === id) negar(tx, 'es-contenedor', 'R-VIS-APP-1', 'El contenedor o refinable no se quita de su propio OPD hijo.', [ref(id), { tipo: 'opd', id: o.id }]);
        if (o.tipo === 'descomposicion' && (o.objetosInternos.includes(id) || o.bandas.some(b => b.includes(id)))) negar(tx, 'es-interno', 'R-VIS-APP-1', 'Es interno: elimínalo del modelo.', [ref(id), { tipo: 'opd', id: o.id }]);
    }
    const apariciones = { ...o.apariciones }; for (const id of ids) delete apariciones[id];
    tx.poner('opds', { ...o, apariciones });
    const v = validarForma(tx.m).find(v => v.regla === 'F-7' && v.refs.some(r => r.tipo === 'opd' && indice(m).hijosDe.get(o.id)?.includes(r.id)));
    if (v) negar(tx, 'forma', v.regla, v.mensaje, [...v.refs, ...[...ids].map(ref)]);
    for (const id of ids) if (!(indice(tx.m).aparicionesDe.get(id)?.length)) tx.traza({ regla: 'R-VIS-APP-1', mensaje: `**${m.cosas[id]!.nombre}** ya no aparece en ningún OPD (sigue en el modelo).`, refs: [ref(id)] });
});
export const eliminarCosas: Operacion<{
    cosas: readonly Id[];
}> = (m, a) => transaccion(m, tx => {
    const ids = new Set(a.cosas), idx = indice(m), borrar = new Set<Id>();
    for (const id of ids) {
        cosa(tx, id);
        const rs = idx.refinamientosDe.get(id);
        if (rs) negar(tx, 'tiene-refinamiento', 'DS-5', 'Elimina primero el refinamiento, de las hojas hacia arriba.', [ref(id), ...Object.values(rs).map(id => ({ tipo: 'opd' as const, id }))]);
        for (const enlace of idx.enlacesDeCosa.get(id) ?? []) borrar.add(enlace);
    }
    for (const id of borrar) tx.quitar('enlaces', id);
    for (const e of Object.values(tx.m.enlaces)) if (e.tipo === 'efecto' && e.escision && borrar.has(e.escision.par)) {
        tx.poner('enlaces', sinCampo(e, 'escision'));
        tx.traza({ regla: 'DR-7', mensaje: 'La mitad escindida superviviente quedó standalone.', refs: [{ tipo: 'enlace', id: e.id }] });
    }
    for (const f of Object.values(m.abanicos)) {
        const enlaces = f.enlaces.filter(id => !borrar.has(id)); if (enlaces.length === f.enlaces.length) continue;
        if (enlaces.length < 2) {
            tx.quitar('abanicos', f.id);
            tx.traza({ regla: 'R-FAN-5', mensaje: 'El abanico se disolvió al quedar con menos de dos ramas.', refs: [{ tipo: 'abanico', id: f.id }] });
        } else tx.poner('abanicos', { ...f, enlaces });
    }
    for (const id of ids) tx.quitar('cosas', id);
    for (const o of Object.values(m.opds)) {
        const apariciones = { ...o.apariciones }; for (const id of ids) delete apariciones[id];
        tx.poner('opds', o.tipo === 'descomposicion' ? { ...o, apariciones, bandas: o.bandas.map(b => b.filter(id => !ids.has(id))).filter(b => b.length), objetosInternos: o.objetosInternos.filter(id => !ids.has(id)) } : { ...o, apariciones });
    }
    const atributos = new Set(Object.values(tx.m.enlaces).flatMap(e => e.tipo === 'exhibicion' ? [e.refinador] : []));
    for (const c of Object.values(tx.m.cosas)) if (c.tipo === 'objeto' && c.valor !== undefined && !atributos.has(c.id)) {
        tx.poner('cosas', sinCampo(c, 'valor'));
        tx.traza({ regla: 'F-13', mensaje: `El valor ${c.valor} de **${c.nombre}** se quitó: ya no es atributo.`, refs: [ref(c.id)] });
    }
});
