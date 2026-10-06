import { validarForma } from './forma';
import { planificarDistribucion } from './refinamiento';
import { esProcedimental, extremos } from './tipos';
import { indice } from './indice';
import { generales } from './herencia';
import { validarEtiqueta } from './lexico';
import type { Familia, TipoEnlace, Modelo, Enlace, EnlaceNuevo, Id, Abanico } from './tipos';
import type { Violacion, Respuesta, Rechazo } from './resultado';
import type { Indice } from './indice';
import type { Accion, EstadosEnlace, ExtremoRef } from './operaciones';
// Una firma de gesto puede estar incompleta; nunca se anuncia como EnlaceNuevo persistible.
type BorradorNuevo = EnlaceNuevo | Omit<Extract<EnlaceNuevo, { tipo: 'etiquetadoBidireccional' }>, 'etiqueta' | 'inversa'>;
type Borrador = Enlace | BorradorNuevo;
export interface DatosEtiquetas { readonly etiqueta?: string | null; readonly inversa?: string | null }
type Clase = 'objeto' | 'proceso' | 'cosa';
export type EstadosFila = 'ninguno' | 'objeto' | 'entradaSalida' | 'parGeneralizacion' | 'origenDestino' | 'soloOrigen' | 'simetrico';
export interface FilaMatriz {
    readonly familia: Familia;
    readonly roles: readonly [
        'objeto',
        'proceso'
    ] | readonly [
        'origen',
        'destino'
    ] | readonly [
        'refinable',
        'refinador'
    ];
    readonly clases: readonly [
        Clase,
        Clase
    ]; // categoría por rol
    readonly mismoTipo: boolean; // R-STRF-1, R-OPL-SE-2
    readonly reflexivo: boolean; // a === b admitido
    readonly estados: EstadosFila;
    readonly control: boolean; // Pre(P): R-MOD-4
    readonly abanico: boolean; // reglas §7.2
    readonly ruta: boolean; // DR-19
    readonly mult: 'objeto' | 'refinador' | 'ambos' | 'ninguno';
    readonly etiquetas: 'ninguna' | 'opcional' | 'doble';
    readonly plantillas: readonly string[]; // ids de §5.3 (opl/plantillas.test exige que existan)
    readonly menu: number; // orden en el menú de tipos (consumo primero)
}
// La tabla es la única autoridad de firma para todos los consumidores.
const fila = (f: FilaMatriz): FilaMatriz => Object.freeze({ ...f, roles: Object.freeze(f.roles), clases: Object.freeze(f.clases), plantillas: Object.freeze(f.plantillas) });
export const MATRIZ: Readonly<Record<TipoEnlace, FilaMatriz>> = Object.freeze({
    consumo: fila({ familia: "transformadora", roles: ["objeto", "proceso"], clases: ["objeto", "proceso"], mismoTipo: false, reflexivo: false, estados: "objeto", control: true, abanico: true, ruta: true, mult: "objeto", etiquetas: "ninguna", plantillas: ["T1", "TS1", "ET1", "ETS1", "CT1", "CS1", "COND-ALT"], menu: 1 }),
    resultado: fila({ familia: "transformadora", roles: ["objeto", "proceso"], clases: ["objeto", "proceso"], mismoTipo: false, reflexivo: false, estados: "objeto", control: false, abanico: true, ruta: true, mult: "objeto", etiquetas: "ninguna", plantillas: ["T2", "TS2"], menu: 2 }),
    efecto: fila({ familia: "transformadora", roles: ["objeto", "proceso"], clases: ["objeto", "proceso"], mismoTipo: false, reflexivo: false, estados: "entradaSalida", control: true, abanico: true, ruta: false, mult: "objeto", etiquetas: "ninguna", plantillas: ["T3", "TS3", "TS4", "TS5", "ET2", "ETS2", "ETS3", "ETS4", "CT2", "CS2", "CS3", "CS4"], menu: 3 }),
    agente: fila({ familia: "habilitadora", roles: ["objeto", "proceso"], clases: ["objeto", "proceso"], mismoTipo: false, reflexivo: false, estados: "objeto", control: true, abanico: true, ruta: false, mult: "objeto", etiquetas: "ninguna", plantillas: ["H1", "HS1", "EH1", "EHS1", "CH1", "CS5"], menu: 4 }),
    instrumento: fila({ familia: "habilitadora", roles: ["objeto", "proceso"], clases: ["objeto", "proceso"], mismoTipo: false, reflexivo: false, estados: "objeto", control: true, abanico: true, ruta: false, mult: "objeto", etiquetas: "ninguna", plantillas: ["H2", "HS2", "EH2", "EHS2", "CH2", "CS6"], menu: 5 }),
    invocacion: fila({ familia: "invocacion", roles: ["origen", "destino"], clases: ["proceso", "proceso"], mismoTipo: true, reflexivo: true, estados: "ninguno", control: false, abanico: true, ruta: false, mult: "ninguno", etiquetas: "ninguna", plantillas: ["IV1", "IV2"], menu: 6 }),
    agregacion: fila({ familia: "estructural", roles: ["refinable", "refinador"], clases: ["cosa", "cosa"], mismoTipo: true, reflexivo: false, estados: "ninguno", control: false, abanico: false, ruta: false, mult: "refinador", etiquetas: "ninguna", plantillas: ["RF1", "RF1i"], menu: 7 }),
    exhibicion: fila({ familia: "estructural", roles: ["refinable", "refinador"], clases: ["cosa", "cosa"], mismoTipo: false, reflexivo: false, estados: "ninguno", control: false, abanico: false, ruta: false, mult: "ninguno", etiquetas: "ninguna", plantillas: ["RF2", "RF2b", "RF2i"], menu: 8 }),
    generalizacion: fila({ familia: "estructural", roles: ["refinable", "refinador"], clases: ["cosa", "cosa"], mismoTipo: true, reflexivo: false, estados: "parGeneralizacion", control: false, abanico: false, ruta: false, mult: "ninguno", etiquetas: "ninguna", plantillas: ["RF3", "RF3b", "RF3i", "RH1", "RFE"], menu: 9 }),
    clasificacion: fila({ familia: "estructural", roles: ["refinable", "refinador"], clases: ["cosa", "cosa"], mismoTipo: true, reflexivo: false, estados: "ninguno", control: false, abanico: false, ruta: false, mult: "ninguno", etiquetas: "ninguna", plantillas: ["RF4", "RF4b"], menu: 10 }),
    etiquetado: fila({ familia: "etiquetada", roles: ["origen", "destino"], clases: ["cosa", "cosa"], mismoTipo: true, reflexivo: true, estados: "origenDestino", control: false, abanico: false, ruta: false, mult: "ambos", etiquetas: "opcional", plantillas: ["SE1", "SE2", "SSE1", "SSE2", "SSE3"], menu: 11 }),
    etiquetadoBidireccional: fila({ familia: "etiquetada", roles: ["origen", "destino"], clases: ["cosa", "cosa"], mismoTipo: true, reflexivo: false, estados: "soloOrigen", control: false, abanico: false, ruta: false, mult: "ambos", etiquetas: "doble", plantillas: ["SE3", "SSE4", "SSE5"], menu: 12 }),
    reciproco: fila({ familia: "etiquetada", roles: ["origen", "destino"], clases: ["cosa", "cosa"], mismoTipo: true, reflexivo: false, estados: "simetrico", control: false, abanico: false, ruta: false, mult: "ambos", etiquetas: "opcional", plantillas: ["SE4", "SE5", "SSE6", "SSE7"], menu: 12 }),
    excepcionSobretiempo: fila({ familia: "excepcion", roles: ["origen", "destino"], clases: ["proceso", "proceso"], mismoTipo: true, reflexivo: false, estados: "ninguno", control: false, abanico: false, ruta: false, mult: "ninguno", etiquetas: "ninguna", plantillas: ["EX1", "EX1r"], menu: 13 }),
    excepcionSubtiempo: fila({ familia: "excepcion", roles: ["origen", "destino"], clases: ["proceso", "proceso"], mismoTipo: true, reflexivo: false, estados: "ninguno", control: false, abanico: false, ruta: false, mult: "ninguno", etiquetas: "ninguna", plantillas: ["EX2", "EX2r"], menu: 14 }),
});
export interface ReglaContexto {
    readonly id: string; // regla canónica o límite de producto declarado
    readonly tipos: readonly TipoEnlace[];
    readonly severidad: 'error' | 'warning'; // warning solo AP-27 con previos omisibles
    readonly codigo?: 'no-ofrecido';
    readonly registro?: 'B-34';
    viola(m: Modelo, e: Enlace, idx: Indice): string | null; // mensaje o null
    readonly accion: string; // acción canónica (R-AP-0B)
    readonly reparacion?: (e: Enlace) => Accion; // ejecutable en un clic
}
const PROCEDIMENTALES: readonly TipoEnlace[] = ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'];
const PRE: readonly TipoEnlace[] = ['consumo', 'efecto', 'agente', 'instrumento'];
const cosa = (m: Modelo, id: Id) => Object.hasOwn(m.cosas, id) ? m.cosas[id] : undefined;
const opd = (m: Modelo, id: Id) => Object.hasOwn(m.opds, id) ? m.opds[id] : undefined;
const control = (e: Enlace | EnlaceNuevo) => 'control' in e ? e.control : undefined;
const subprocesos = (m: Modelo, p: Id, idx: Indice): readonly Id[] => {
    const id = idx.refinamientosDe.get(p)?.descomposicion, o = id ? opd(m, id) : undefined;
    return o?.tipo === 'descomposicion' ? o.bandas.flat() : [];
};
function ancestros(m: Modelo, p: Id, idx: Indice): ReadonlySet<Id> {
    const vistos = new Set<Id>();
    while (!vistos.has(p)) {
        vistos.add(p);
        const padre = idx.subprocesoDe.get(p), o = padre ? opd(m, padre.opd) : undefined;
        if (!o || o.tipo !== 'descomposicion')
            break;
        p = o.cosa;
    }
    return vistos;
}
function colision(m: Modelo, e: Enlace, idx: Indice): Enlace | undefined {
    if (!esProcedimental(e))
        return undefined;
    const as = ancestros(m, e.proceso, idx), fan = idx.abanicoDeEnlace.get(e.id);
    return Object.values(m.enlaces).find(x => x.id !== e.id && esProcedimental(x) && x.objeto === e.objeto
        && (as.has(x.proceso) || ancestros(m, x.proceso, idx).has(e.proceso))
        && !(fan !== undefined && fan === idx.abanicoDeEnlace.get(x.id)));
}
// RROL1 permite el instrumento abstracto afectado en detalle cuando el cambio
// explícito prueba entrada=salida. Es un límite recuperable del producto, no F5.
function rolCero(m: Modelo, e: Enlace, idx: Indice): boolean {
    const otro = colision(m, e, idx);
    if (!otro) return false;
    const instrumento = e.tipo === 'instrumento' ? e : otro.tipo === 'instrumento' ? otro : undefined;
    const efecto = e.tipo === 'efecto' ? e : otro.tipo === 'efecto' ? otro : undefined;
    return !!instrumento && !!efecto && efecto.entrada !== undefined && efecto.entrada === efecto.salida
        && instrumento.proceso !== efecto.proceso && ancestros(m, efecto.proceso, idx).has(instrumento.proceso);
}
function previos(m: Modelo, e: Enlace, idx: Indice): {
    evento: boolean;
    obligatorio: boolean;
} {
    if (!esProcedimental(e) || control(e) !== 'e')
        return { evento: false, obligatorio: false };
    const sub = idx.subprocesoDe.get(e.proceso), o = sub ? opd(m, sub.opd) : undefined;
    if (!sub || sub.banda === 0 || o?.tipo !== 'descomposicion')
        return { evento: false, obligatorio: false };
    const procesos = new Set(o.bandas.slice(0, sub.banda).flat());
    const obligatorio = Object.values(m.enlaces).some(x => esProcedimental(x) && ['consumo', 'resultado', 'efecto'].includes(x.tipo) && procesos.has(x.proceso) && control(x) !== 'c');
    return { evento: true, obligatorio };
}
// Un par escindido conserva la precedencia original incluso entre niveles anidados.
// La misma banda o un árbol sin orden común no acredita una inversión temporal.
function escisionInvertida(m: Modelo, e: Enlace, idx: Indice): boolean {
    if (e.tipo !== 'efecto' || e.escision?.mitad !== 'entrada') return false;
    const salida = m.enlaces[e.escision.par];
    if (salida?.tipo !== 'efecto') return false;
    const bandas = new Map<Id, number>(), vistos = new Set<Id>();
    let p: Id = e.proceso;
    while (!vistos.has(p)) {
        vistos.add(p);
        const sub = idx.subprocesoDe.get(p), o = sub ? m.opds[sub.opd] : undefined;
        if (!sub || o?.tipo !== 'descomposicion') break;
        bandas.set(o.id, sub.banda); p = o.cosa;
    }
    vistos.clear(); p = salida.proceso;
    while (!vistos.has(p)) {
        vistos.add(p);
        const sub = idx.subprocesoDe.get(p), o = sub ? m.opds[sub.opd] : undefined;
        if (!sub || o?.tipo !== 'descomposicion') break;
        const entrada = bandas.get(o.id);
        if (entrada !== undefined && entrada !== sub.banda) return entrada > sub.banda;
        p = o.cosa;
    }
    return false;
}
function duplicaHeredado(m: Modelo, e: Enlace, idx: Indice): boolean {
    if (!esProcedimental(e) && !['agregacion', 'exhibicion', 'etiquetado', 'etiquetadoBidireccional', 'reciproco'].includes(e.tipo)) return false;
    const campos = esProcedimental(e) ? ['objeto', 'proceso'] as const : 'refinable' in e ? ['refinable', 'refinador'] as const : ['origen', 'destino'] as const;
    for (const campo of campos) {
        const id = (e as unknown as Record<string, Id>)[campo]!;
        for (const general of generales(m, id)) {
            const elevado = { ...e, [campo]: general } as Enlace;
            for (const eid of idx.enlacesDeCosa.get(general) ?? []) {
                const original = m.enlaces[eid]!;
                if (eid !== e.id && mismoHecho(elevado, original)) return true;
            }
        }
    }
    return false;
}
const regla = (r: ReglaContexto): ReglaContexto => Object.freeze({ ...r, tipos: Object.freeze([...r.tipos]) });
export const REGLAS_CONTEXTO: readonly ReglaContexto[] = Object.freeze([
    regla({ id: 'AP-29', tipos: [...PROCEDIMENTALES, 'agregacion', 'exhibicion', 'etiquetado', 'etiquetadoBidireccional', 'reciproco'], severidad: 'error', accion: 'Conserva el hecho del general; no dupliques explícitamente un enlace heredado', viola(m, e, idx) { return duplicaHeredado(m, e, idx) ? 'El enlace duplica un hecho heredado del general (R-HER-8).' : null; } }),
    regla({ id: 'R-ESCIND-2', tipos: ['efecto'], severidad: 'error', accion: 'Conserva la mitad de entrada antes de la salida al ordenar bandas', viola(m, e, idx) { return escisionInvertida(m, e, idx) ? 'La mitad de salida precede a la mitad de entrada del par escindido (R-ESCIND-3).' : null; } }),
    regla({ id: 'R-AG-1', tipos: ['agente'], severidad: 'error', accion: 'Usa instrumento para máquinas, software o IA; si es humano, márcalo físico', viola(m, e) { return e.tipo === 'agente' && cosa(m, e.objeto)?.esencia !== 'fisica' ? 'El agente debe ser un objeto físico (proxy declarado de humano).' : null; } }),
    regla({ id: 'R-EFE-1', tipos: ['efecto'], severidad: 'error', accion: 'Agrega estados al objeto o usa consumo/resultado', viola(m, e) {
            if (e.tipo !== 'efecto' || e.entrada || e.salida)
                return null;
            return [e.objeto, ...generales(m, e.objeto)].some(id => { const c = cosa(m, id); return c?.tipo === 'objeto' && c.estados.length > 0; }) ? null : 'El efecto requiere estados propios o heredados.';
        } }),
    regla({ id: 'R-RES-1', tipos: ['resultado'], severidad: 'error', accion: 'Ánclalo al objeto o a un estado no inicial', viola(m, e) {
            if (e.tipo !== 'resultado' || !e.estado)
                return null;
            const c = cosa(m, e.objeto);
            return c?.tipo === 'objeto' && c.estados.some(s => s.id === e.estado && s.inicial) ? 'El resultado nunca se ancla al estado inicial.' : null;
        } }),
    regla({ id: 'R-ROL-1', tipos: PROCEDIMENTALES, severidad: 'error', codigo: 'no-ofrecido', registro: 'B-34', accion: 'Conserva los hechos importados; esta combinación permitida por RROL1 no está ofrecida por el producto', viola(m, e, idx) { return rolCero(m, e, idx) ? 'RROL1 permite instrumento abstracto y cambio explícito neto cero en detalle; el producto aún no ofrece esta combinación (B-34).' : null; } }),
    regla({ id: 'R-ROL-UNIC-1', tipos: PROCEDIMENTALES, severidad: 'error', accion: 'Un solo rol por par objeto–proceso: edita el existente, completa el cambio o forma un abanico', viola(m, e, idx) { return colision(m, e, idx) && !rolCero(m, e, idx) ? 'Ya existe un rol procedimental para el objeto y el proceso o su ancestro/descendiente.' : null; } }),
    regla({ id: 'R-DIST-1', tipos: ['consumo', 'resultado'], severidad: 'error', accion: 'Migra al primer/último subproceso', reparacion: e => ({ op: 'distribuirEnlace', args: { enlace: e.id } }), viola(m, e, idx) { return esProcedimental(e) && subprocesos(m, e.proceso, idx).length > 0 ? 'Consumo y resultado no pueden quedar en el contorno descompuesto.' : null; } }),
    regla({ id: 'R-CX-DIST-2', tipos: PRE, severidad: 'error', accion: 'Mueve el evento al primer subproceso o marca ambiental el objeto', reparacion: e => ({ op: 'distribuirEnlace', args: { enlace: e.id } }), viola(m, e, idx) { return esProcedimental(e) && control(e) === 'e' && cosa(m, e.objeto)?.afiliacion === 'sistemica' && subprocesos(m, e.proceso, idx).length > 0 ? 'El evento sistémico no cruza la frontera temporal.' : null; } }),
    regla({ id: 'AP-07', tipos: ['efecto'], severidad: 'error', accion: 'Escinde: TS4 en el primero, TS5 en el último', reparacion: e => ({ op: 'distribuirEnlace', args: { enlace: e.id } }), viola(m, e, idx) { return e.tipo === 'efecto' && e.entrada !== undefined && e.salida !== undefined && subprocesos(m, e.proceso, idx).length >= 2 ? 'El cambio completo debe escindirse al descomponer.' : null; } }),
    regla({ id: 'AP-27', tipos: PRE, severidad: 'error', accion: 'Dirige el evento al primer subproceso o declara la omisión (c) de los previos', viola(m, e, idx) { const p = previos(m, e, idx); return p.evento && p.obligatorio ? 'El evento omite una banda anterior con transformación obligatoria.' : null; } }),
    regla({ id: 'AP-27', tipos: PRE, severidad: 'warning', accion: 'Dirige el evento al primer subproceso o declara la omisión (c) de los previos', viola(m, e, idx) { const p = previos(m, e, idx); return p.evento && !p.obligatorio ? 'El evento llega a una banda no primera; los previos son omisibles.' : null; } }),
    regla({ id: 'R-INV-2B', tipos: ['invocacion'], severidad: 'error', accion: 'Quita el rayo: la secuencia ya invoca la banda siguiente', reparacion: e => ({ op: 'eliminarEnlaces', args: { enlaces: [e.id] } }), viola(_m, e, idx) {
            if (e.tipo !== 'invocacion')
                return null;
            const a = idx.subprocesoDe.get(e.origen), b = idx.subprocesoDe.get(e.destino);
            return a && b && a.opd === b.opd && b.banda === a.banda + 1 ? 'La invocación duplica la transición a la banda siguiente.' : null;
        } }),
]);
function contexto(m: Modelo, e: Enlace, erroresSolo: boolean): readonly Violacion[] {
    const idx = indice(m), vs: Violacion[] = [];
    for (const r of REGLAS_CONTEXTO) {
        if (!r.tipos.includes(e.tipo) || erroresSolo && r.severidad !== 'error')
            continue;
        const mensaje = r.viola(m, e, idx);
        if (mensaje)
            vs.push({ codigo: r.codigo ?? 'enlace-invalido', regla: r.id, mensaje, accion: r.accion, refs: [{ tipo: 'enlace', id: e.id }] });
    }
    return vs;
}
export function violacionesContexto(m: Modelo, e: Enlace): readonly Violacion[] { return contexto(m, e, false); }
export function violacionesAbanico(m: Modelo, f: Abanico): readonly Violacion[] {
    const vs: Violacion[] = [], es = f.enlaces.map(id => Object.hasOwn(m.enlaces, id) ? m.enlaces[id] : undefined);
    const fallo = (regla: string, mensaje: string) => vs.push({ codigo: 'abanico-invalido', regla, mensaje, refs: [{ tipo: 'abanico', id: f.id }] });
    if (f.enlaces.length < 2 || new Set(f.enlaces).size !== f.enlaces.length || es.some(e => !e)) {
        fallo('R-FAN-GEO-2', 'El abanico requiere al menos dos ramas existentes distintas.');
        return vs;
    }
    const ramas = es.filter((e): e is Enlace => e !== undefined), primero = ramas[0]!;
    if (!MATRIZ[primero.tipo].abanico || ramas.some(e => e.tipo !== primero.tipo))
        fallo('R-FAN-GEO-2', 'Las ramas deben ser del mismo tipo y admitir abanico.');
    if (ramas.some((e, i) => ramas.slice(0, i).some(x => mismoHecho(x, e))))
        fallo('R-FAN-GEO-2', 'Las ramas deben representar enlaces distintos.');
    if (!comun(ramas))
        fallo('R-FAN-GEO-2', 'Las ramas no tienen un extremo común.');
    if (ramas.some(e => control(e) !== control(primero)))
        fallo('R-FAN-3', 'El control debe ser uniforme en todas las ramas (R-ZNC-COMB-1).');
    for (const e of ramas)
        if (control(e) !== undefined && !MATRIZ[e.tipo].control) {
            fallo('R-MOD-4', 'El control no está permitido en este tipo de abanico.');
            break;
        }
    return vs;
}
function comun(es: readonly (Enlace | EnlaceNuevo)[]): 'objeto' | 'proceso' | 'origen' | 'destino' | null {
    const e = es[0];
    if (!e)
        return null;
    if (esProcedimental(e)) {
        if (es.every(x => esProcedimental(x) && x.proceso === e.proceso))
            return 'proceso';
        if (es.every(x => esProcedimental(x) && x.objeto === e.objeto))
            return 'objeto';
    }
    else {
        const ex = extremos(e);
        if (es.every(x => extremos(x).origen === ex.origen))
            return 'origen';
        if (es.every(x => extremos(x).destino === ex.destino))
            return 'destino';
    }
    return null;
}
export interface FilaNoOfrecido {
    readonly id: string;
    readonly regla: string;
    readonly motivo: string;
    readonly registro: `B-${number}`;
}
export const NO_OFRECIDO: readonly FilaNoOfrecido[] = Object.freeze([
    Object.freeze({ id: 'nf-mult-sin-hueco', regla: 'DR-44', motivo: 'La plantilla no tiene hueco para multiplicidad junto a c, efecto con estados, etiquetado con estados o multiplicidades de rama distintas en un extremo común.', registro: 'B-04' as const }),
    Object.freeze({ id: 'nf-reciproco-estados-sin-etiqueta', regla: 'reglas §4.10', motivo: 'El recíproco con estados requiere etiqueta; SE5 no tiene variante con estado.', registro: 'B-05' as const }),
    Object.freeze({ id: 'nf-abanico-estado-comun', regla: 'R-FAN-EST-1', motivo: 'El extremo común del abanico debe estar en el borde de una cosa, no en un estado (DEC 29).', registro: 'B-06' as const }),
    Object.freeze({ id: 'nf-abanico-efecto-mixto', regla: 'R-FAN-5/5A', motivo: 'El abanico de efecto requiere T3 puro, FAN5s/FAN5e o TS3 con entrada común (FAN5A).', registro: 'B-06' as const }),
    Object.freeze({ id: 'nf-abanico-control', regla: 'T-056', motivo: 'Esta combinación de abanico y control es canónica pero carece de plantilla literal.', registro: 'B-08' as const }),
    Object.freeze({ id: 'nf-descomposicion-objeto', regla: 'R-OPL-CX-4', motivo: 'La descomposición de objeto no se ofrece (DR-23).', registro: 'B-02' as const }),
]);
const no = (id: string): FilaNoOfrecido => NO_OFRECIDO.find(r => r.id === id)!;
// Descomponer no es un enlace. El dueño de la operación consultará esta misma fila.
export function noOfrecidoDescomposicion(m: Modelo, id: Id): FilaNoOfrecido | null { return cosa(m, id)?.tipo === 'objeto' ? no('nf-descomposicion-objeto') : null; }
export function noOfrecido(m: Modelo, e: Enlace | EnlaceNuevo, abanico?: Abanico): FilaNoOfrecido | null {
    const mult = ('mult' in e && e.mult !== undefined) || ('multOrigen' in e && e.multOrigen !== undefined) || ('multDestino' in e && e.multDestino !== undefined);
    const estados = anclajes(e).length > 0;
    if (mult && (control(e) === 'c' || e.tipo === 'efecto' && estados || MATRIZ[e.tipo].familia === 'etiquetada' && estados))
        return no('nf-mult-sin-hueco');
    if (e.tipo === 'reciproco' && e.estados && !e.etiqueta?.trim())
        return no('nf-reciproco-estados-sin-etiqueta');
    if (!abanico || violacionesAbanico(m, abanico).length)
        return null;
    const es = abanico.enlaces.map(id => m.enlaces[id]!), c = comun(es), primero = es[0]!;
    if (es.some(x => 'mult' in x && x.mult !== undefined)) {
        const sinHueco = es.some(x => control(x) === 'c' || x.tipo === 'efecto' && anclajes(x).length > 0);
        const comunSinHueco = c === 'objeto' && (primero.tipo === 'agente' || primero.tipo === 'efecto'
            || es.some(x => !('mult' in x) || !('mult' in primero) || x.mult !== primero.mult));
        if (sinHueco || comunSinHueco) return no('nf-mult-sin-hueco');
    }
    if (c === 'objeto' && es.some(x => anclajes(x).length > 0))
        return no('nf-abanico-estado-comun');
    if (primero.tipo === 'efecto') {
        const efectos = es.filter((x): x is Extract<Enlace, {
            tipo: 'efecto';
        }> => x.tipo === 'efecto');
        const puros = efectos.every(x => x.entrada === undefined && x.salida === undefined);
        const entradaComun = efectos.every(x => x.entrada === primero.entrada) && primero.entrada !== undefined;
        const mismoPar = efectos.every(x => x.objeto === primero.objeto && x.proceso === primero.proceso);
        const soloEntrada = efectos.every(x => x.entrada !== undefined && x.salida === undefined);
        const soloSalida = efectos.every(x => x.salida !== undefined && x.entrada === undefined);
        const completos = efectos.every(x => x.entrada !== undefined && x.salida !== undefined);
        if (!(puros || mismoPar && (soloEntrada || soloSalida || completos && entradaComun)))
            return no('nf-abanico-efecto-mixto');
    }
    const ctrl = control(primero);
    if (primero.tipo === 'consumo' && c === 'proceso' && ctrl === 'c' && es.some(x => anclajes(x).length > 0))
        return no('nf-abanico-control');
    if (ctrl !== undefined && !(primero.tipo === 'consumo' && c === 'proceso' && ctrl === 'c' || primero.tipo === 'efecto' && c === 'objeto' && (ctrl === 'c' || ctrl === 'e')))
        return no('nf-abanico-control');
    return null;
}
export type Alternativa = {
    readonly k: 'completarCambio';
    readonly enlace: Id;
    readonly estados: EstadosEnlace;
} // TS4/TS5 ⇒ TS3
 | {
    readonly k: 'abanicoCon';
    readonly enlace: Id;
} // ofrecer XOR y OR
 | {
    readonly k: 'cambiarTipoExistente';
    readonly enlace: Id;
};
export type OpcionTipo = {
    readonly tipo: TipoEnlace;
    readonly sentido: 'directo' | 'inverso';
    readonly legal: true;
    readonly candidato: EnlaceNuevo;
    readonly avisos: readonly Violacion[];
} | {
    readonly tipo: TipoEnlace;
    readonly sentido: 'directo' | 'inverso';
    readonly legal: false;
    readonly motivo: Violacion;
    readonly alternativa?: Alternativa;
} | {
    readonly tipo: 'etiquetadoBidireccional';
    readonly sentido: 'directo' | 'inverso';
    readonly legal: 'pendiente';
    readonly requiere: readonly ['etiqueta', 'inversa'];
    readonly avisos: readonly Violacion[];
} | {
    readonly tipo: 'reciproco';
    readonly sentido: 'directo' | 'inverso';
    readonly legal: 'pendiente';
    readonly requiere: readonly ['etiqueta'];
    readonly avisos: readonly Violacion[];
};
function roles(e: Borrador): readonly [
    Id,
    Id
] { return 'objeto' in e ? [e.objeto, e.proceso] : 'refinable' in e ? [e.refinable, e.refinador] : [e.origen, e.destino]; }
function anclajes(e: Borrador): readonly (readonly [
    Id,
    Id
])[] {
    switch (e.tipo) {
        case 'consumo':
        case 'resultado':
        case 'agente':
        case 'instrumento': return e.estado ? [[e.estado, e.objeto]] : [];
        case 'efecto': return [...(e.entrada ? [[e.entrada, e.objeto] as const] : []), ...(e.salida ? [[e.salida, e.objeto] as const] : [])];
        case 'generalizacion': return e.estados ? [[e.estados.general, e.refinable], [e.estados.especializacion, e.refinador]] : [];
        case 'etiquetado': return [...(e.estadoOrigen ? [[e.estadoOrigen, e.origen] as const] : []), ...(e.estadoDestino ? [[e.estadoDestino, e.destino] as const] : [])];
        case 'etiquetadoBidireccional': return e.estadoOrigen ? [[e.estadoOrigen, e.origen]] : [];
        case 'reciproco': return e.estados ? [[e.estados.origen, e.origen], ...(e.estados.destino ? [[e.estados.destino, e.destino] as const] : [])] : [];
        default: return [];
    }
}
export function violacionesForma(m: Modelo, e: Enlace | EnlaceNuevo): readonly Violacion[] { return forma(m, e); }
function forma(m: Modelo, e: Borrador): readonly Violacion[] {
    const vs: Violacion[] = [], f = MATRIZ[e.tipo], [a, b] = roles(e), ca = cosa(m, a), cb = cosa(m, b), idx = indice(m);
    const fallo = (regla: string, mensaje: string) => vs.push({ codigo: 'forma', regla, mensaje, refs: 'id' in e ? [{ tipo: 'enlace' as const, id: e.id }] : [] });
    if (!ca || !cb || f.clases[0] !== 'cosa' && ca.tipo !== f.clases[0] || f.clases[1] !== 'cosa' && cb.tipo !== f.clases[1] || f.mismoTipo && ca?.tipo !== cb?.tipo || !f.reflexivo && a === b)
        fallo('R-EDIT-1', 'Las categorías, tipos o reflexividad de los extremos no corresponden a la matriz.');
    for (const [s, c] of anclajes(e))
        if (idx.estadoDe.get(s)?.objeto !== c || cosa(m, c)?.tipo !== 'objeto')
            fallo('R-EDIT-2', 'El estado debe pertenecer al objeto del extremo.');
    if (e.tipo === 'generalizacion' && e.estados && (ca?.tipo !== 'objeto' || cb?.tipo !== 'objeto' || !e.estados.general || !e.estados.especializacion))
        fallo('R-OPL-RF-3', 'La generalización de estado exige el par completo entre objetos.');
    // Datos no tipables pueden llegar de un import; no se aceptan modificadores ajenos a la fila.
    const datos: Readonly<Record<string, unknown>> = { ...e };
    const camposEstado: Readonly<Record<EstadosFila, readonly string[]>> = {
        ninguno: [], objeto: ['estado'], entradaSalida: ['entrada', 'salida'],
        parGeneralizacion: ['estados'], origenDestino: ['estadoOrigen', 'estadoDestino'],
        soloOrigen: ['estadoOrigen'], simetrico: ['estados'],
    };
    if (['estado', 'entrada', 'salida', 'estadoOrigen', 'estadoDestino'].some(k => datos[k] !== undefined && (typeof datos[k] !== 'string' || !datos[k])))
        fallo('R-EDIT-2', 'El anclaje debe ser un id de estado no vacío.');
    if (['estado', 'entrada', 'salida', 'estados', 'estadoOrigen', 'estadoDestino'].some(k => datos[k] !== undefined && !camposEstado[f.estados].includes(k)))
        fallo('R-EDIT-2', 'El campo de estado no corresponde a esta fila de la matriz.');
    if (datos.control !== undefined && (!f.control || !['e', 'c'].includes(String(datos.control))))
        fallo('R-MOD-4', 'El control solo puede ser c o e y solo en una entrada canónica.');
    if (e.tipo === 'efecto' && e.escision && e.control !== undefined)
        fallo('R-ESCIND-0', 'La mitad escindida no admite control.');
    if (datos.ruta !== undefined && (!f.ruta || typeof datos.ruta !== 'string' || !datos.ruta.trim()))
        fallo('R-OPL-RUTA-2', 'La ruta debe tener nombre y solo se admite en consumo/resultado.');
    if (['multOrigen', 'multDestino'].some(k => datos[k] !== undefined && !['?', '*', '+'].includes(String(datos[k]))))
        fallo('R-MULT-1', 'La multiplicidad debe ser ?, * o +.');
    if (datos.mult !== undefined && (!['objeto', 'refinador'].includes(f.mult) || !['?', '*', '+'].includes(String(datos.mult))) || (datos.multOrigen !== undefined || datos.multDestino !== undefined) && f.mult !== 'ambos')
        fallo('R-MULT-1', 'Multiplicidad en un rol no admitido.');
    if (e.tipo === 'reciproco' && e.estados && !e.estados.origen || e.tipo === 'etiquetadoBidireccional' && datos.estadoDestino !== undefined)
        fallo('AP-11', 'El enlace bidireccional o recíproco no admite estado solo en destino.');
    return vs;
}
function candidato(tipo: TipoEnlace, desde: ExtremoRef, hacia: ExtremoRef, sentido: 'directo' | 'inverso'): BorradorNuevo {
    const a = sentido === 'directo' ? desde : hacia, b = sentido === 'directo' ? hacia : desde;
    switch (tipo) {
        case 'consumo':
        case 'agente':
        case 'instrumento': return { tipo, objeto: a.cosa, proceso: b.cosa, ...(a.estado ? { estado: a.estado } : {}) };
        case 'resultado': return { tipo, objeto: b.cosa, proceso: a.cosa, ...(b.estado ? { estado: b.estado } : {}) };
        case 'efecto': {
            // Dirección v0 proceso→objeto; los estados siguen la dirección del gesto.
            const obj = b, proc = a;
            return { tipo, objeto: obj.cosa, proceso: proc.cosa, ...(desde.estado && desde.cosa === obj.cosa ? { entrada: desde.estado } : {}), ...(hacia.estado && hacia.cosa === obj.cosa ? { salida: hacia.estado } : {}) };
        }
        case 'agregacion':
        case 'exhibicion':
        case 'clasificacion': return { tipo, refinable: a.cosa, refinador: b.cosa };
        case 'generalizacion': return { tipo, refinable: a.cosa, refinador: b.cosa, ...(a.estado && b.estado ? { estados: { general: a.estado, especializacion: b.estado } } : {}) };
        case 'etiquetado': return { tipo, origen: a.cosa, destino: b.cosa, ...(a.estado ? { estadoOrigen: a.estado } : {}), ...(b.estado ? { estadoDestino: b.estado } : {}) };
        case 'etiquetadoBidireccional': return { tipo, origen: a.cosa, destino: b.cosa, ...(a.estado ? { estadoOrigen: a.estado } : {}) };
        case 'reciproco': return { tipo, origen: a.cosa, destino: b.cosa, ...(a.estado ? { estados: { origen: a.estado, ...(b.estado ? { destino: b.estado } : {}) } } : {}) };
        default: return { tipo, origen: a.cosa, destino: b.cosa };
    }
}
function estadoGesto(e: BorradorNuevo, desde: ExtremoRef, hacia: ExtremoRef): boolean {
    const esperados = [desde, hacia].filter(x => x.estado !== undefined);
    const usados = anclajes(e);
    return esperados.every(x => usados.some(([s, c]) => s === x.estado && c === x.cosa));
}
// Orden de propiedades irrelevante a cualquier profundidad; el orden de listas sí es semántico.
function datoSemantico(dato: unknown): unknown {
    if (Array.isArray(dato)) return dato.map(datoSemantico);
    if (dato !== null && typeof dato === 'object')
        return Object.fromEntries(Object.entries(dato).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, datoSemantico(v)]));
    return dato;
}
function mismoHecho(a: Enlace | EnlaceNuevo, b: Enlace | EnlaceNuevo): boolean {
    const datos = (e: Enlace | EnlaceNuevo) => datoSemantico(Object.fromEntries(Object.entries(e).filter(([k]) => k !== 'id')));
    return JSON.stringify(datos(a)) === JSON.stringify(datos(b));
}
function rechazoEtiqueta(valor: unknown, requerida: boolean): Rechazo | null {
    if (!requerida && (valor === undefined || valor === null)) return null;
    return validarEtiqueta(typeof valor === 'string' ? valor : '');
}
export function normalizarEtiquetas(e: EnlaceNuevo): Respuesta<EnlaceNuevo> {
    if (MATRIZ[e.tipo].etiquetas === 'ninguna') return { ok: true, valor: e, trazas: [] };
    if (e.tipo === 'etiquetadoBidireccional') {
        const rechazo = rechazoEtiqueta(e.etiqueta, true) ?? rechazoEtiqueta(e.inversa, true);
        if (rechazo) return { ok: false, rechazo };
        if (e.etiqueta === e.inversa) {
            const { tipo, inversa, estadoOrigen, ...resto } = e;
            return { ok: true, valor: { ...resto, tipo: 'reciproco', ...(estadoOrigen !== undefined ? { estados: { origen: estadoOrigen } } : {}) },
                trazas: [{ regla: 'R-STRE-1', mensaje: `Etiquetas iguales «${e.etiqueta}» y «${inversa}»: normalizado a recíproco.`, refs: [] }] };
        }
    } else if (e.tipo === 'etiquetado' || e.tipo === 'reciproco') {
        const rechazo = rechazoEtiqueta(e.etiqueta, e.tipo === 'reciproco' && e.estados !== undefined);
        if (rechazo) return { ok: false, rechazo };
        if (e.etiqueta === undefined || e.etiqueta === null) {
            const { etiqueta, ...resto } = e;
            return { ok: true, valor: resto, trazas: [] };
        }
    }
    return { ok: true, valor: e, trazas: [] };
}
type Completacion = Respuesta<EnlaceNuevo> | { readonly ok: 'pendiente'; readonly tipo: 'etiquetadoBidireccional'; readonly requiere: readonly ['etiqueta', 'inversa'] }
    | { readonly ok: 'pendiente'; readonly tipo: 'reciproco'; readonly requiere: readonly ['etiqueta'] };
function completarEtiquetas(e: BorradorNuevo, datos: DatosEtiquetas = {}): Completacion {
    if (e.tipo === 'etiquetadoBidireccional') {
        // Lo explícito inválido prevalece incluso si el otro campo aún falta.
        const rechazo = (datos.etiqueta !== undefined ? rechazoEtiqueta(datos.etiqueta, true) : null)
            ?? (datos.inversa !== undefined ? rechazoEtiqueta(datos.inversa, true) : null);
        if (rechazo) return { ok: false, rechazo };
        if (datos.etiqueta === undefined || datos.inversa === undefined)
            return { ok: 'pendiente', tipo: e.tipo, requiere: ['etiqueta', 'inversa'] };
        if (typeof datos.etiqueta !== 'string' || typeof datos.inversa !== 'string')
            return { ok: false, rechazo: validarEtiqueta('')! };
        return { ok: true, valor: { ...e, etiqueta: datos.etiqueta, inversa: datos.inversa }, trazas: [] };
    }
    if (e.tipo === 'etiquetado' || e.tipo === 'reciproco') {
        const requerida = e.tipo === 'reciproco' && e.estados !== undefined;
        if (requerida && datos.etiqueta === undefined)
            return { ok: 'pendiente', tipo: 'reciproco', requiere: ['etiqueta'] };
        const rechazo = rechazoEtiqueta(datos.etiqueta, requerida);
        if (rechazo) return { ok: false, rechazo };
        return { ok: true, valor: { ...e, ...(typeof datos.etiqueta === 'string' ? { etiqueta: datos.etiqueta } : {}) }, trazas: [] };
    }
    return { ok: true, valor: e, trazas: [] };
}
function alternativa(m: Modelo, candidato: Enlace, existente: Enlace): Alternativa {
    if (candidato.tipo === 'efecto' && existente.tipo === 'efecto' && candidato.objeto === existente.objeto && candidato.proceso === existente.proceso) {
        if (existente.entrada && !existente.salida && candidato.salida)
            return { k: 'completarCambio', enlace: existente.id, estados: { entrada: existente.entrada, salida: candidato.salida } };
        if (existente.salida && !existente.entrada && candidato.entrada)
            return { k: 'completarCambio', enlace: existente.id, estados: { entrada: candidato.entrada, salida: existente.salida } };
    }
    if (candidato.tipo === existente.tipo && !mismoHecho(candidato, existente) && !indice(m).abanicoDeEnlace.has(existente.id)) {
        const f: Abanico = { id: 'f-candidato', operador: 'XOR', enlaces: [existente.id, candidato.id] }, n: Modelo = { ...m, enlaces: { ...m.enlaces, [candidato.id]: candidato } };
        if (!violacionesAbanico(n, f).length && !noOfrecido(n, candidato, f))
            return { k: 'abanicoCon', enlace: existente.id };
    }
    return { k: 'cambiarTipoExistente', enlace: existente.id };
}
export function tiposLegales(m: Modelo, a: {
    readonly opd: Id;
    readonly desde: ExtremoRef;
    readonly hacia: ExtremoRef;
    readonly etiquetas?: DatosEtiquetas;
}): readonly OpcionTipo[] {
    const resultado: OpcionTipo[] = [], idx = indice(m), o = opd(m, a.opd);
    const motivo = (codigo: string, regla: string, mensaje: string): Violacion => ({ codigo, regla, mensaje, refs: [] });
    let id = 'e-candidato';
    while (Object.hasOwn(m.enlaces, id)) id += '-candidato';
    for (const tipo of Object.keys(MATRIZ) as TipoEnlace[])
        for (const sentido of ['directo', 'inverso'] as const) {
            const borrador = candidato(tipo, a.desde, a.hacia, sentido);
            let v = forma(m, borrador)[0];
            if (!v && !estadoGesto(borrador, a.desde, a.hacia))
                v = motivo('forma', 'R-EDIT-2', 'La fila no admite los estados en los roles del gesto.');
            if (!v)
                for (const [c, otra] of [[a.desde.cosa, a.hacia.cosa], [a.hacia.cosa, a.desde.cosa]]) {
                    const dueño = idx.internoDe.get(c!);
                    if (dueño && !Object.hasOwn(opd(m, dueño)?.apariciones ?? {}, otra!)) {
                        v = motivo('interno-no-visible', 'T-066', 'Un interno solo enlaza cosas visibles en su OPD dueño.');
                        break;
                    }
                }
            if (!v && (!o || !Object.hasOwn(o.apariciones, a.desde.cosa) || !Object.hasOwn(o.apariciones, a.hacia.cosa)))
                v = motivo('no-visible', 'R-EDIT-1', 'Ambos extremos deben aparecer en el OPD.');
            if (v) { resultado.push({ tipo, sentido, legal: false, motivo: v }); continue; }
            const completo = completarEtiquetas(borrador, a.etiquetas);
            if (completo.ok === 'pendiente') {
                if (completo.tipo === 'etiquetadoBidireccional')
                    resultado.push({ tipo: completo.tipo, sentido, legal: 'pendiente', requiere: completo.requiere, avisos: [] });
                else resultado.push({ tipo: completo.tipo, sentido, legal: 'pendiente', requiere: completo.requiere, avisos: [] });
                continue;
            }
            if (completo.ok === false) { resultado.push({ tipo, sentido, legal: false, motivo: completo.rechazo }); continue; }
            const normal = normalizarEtiquetas(completo.valor);
            if (!normal.ok) { resultado.push({ tipo, sentido, legal: false, motivo: normal.rechazo }); continue; }
            const nuevo = normal.valor, e: Enlace = { ...nuevo, id };
            v = violacionesForma(m, nuevo)[0];
            const nf = !v ? noOfrecido(m, nuevo) : null;
            if (nf) v = motivo('no-ofrecido', nf.regla, nf.motivo);
            if (!v && Object.values(m.enlaces).some(x => mismoHecho(x, nuevo)))
                v = motivo('ya-existe', 'R-EDIT-1', 'El mismo enlace ya existe.');
            const ensayo = !v ? planificarDistribucion({ ...m, enlaces: { ...m.enlaces, [id]: e } }, { opd: a.opd, enlace: e }) : undefined;
            if (ensayo && !ensayo.ok) v = { codigo: ensayo.rechazo.codigo, regla: ensayo.rechazo.regla, mensaje: ensayo.rechazo.mensaje, refs: ensayo.rechazo.refs };
            const efectivo = ensayo?.ok ? ensayo.valor.modelo : m;
            if (!v) v = validarForma(efectivo)[0];
            const claveError = (v: Violacion) => JSON.stringify([v.codigo, v.refs.map(r => `${r.tipo}:${r.id}`).sort()]);
            const previos = new Set(!v ? erroresContexto(m).map(claveError) : []);
            const vs = !v ? erroresContexto(efectivo).filter(v => !previos.has(claveError(v))) : [];
            const arista = efectivo.enlaces[id] ?? e;
            const avisos = !v ? contexto(efectivo, arista, false).filter(x => !vs.some(y => y.regla === x.regla)) : [];
            v ??= vs[0];
            if (v) {
                const existente = v.regla === 'R-ROL-UNIC-1' ? colision(m, e, idx) : undefined;
                const mismoPar = existente && esProcedimental(e) && esProcedimental(existente) && e.objeto === existente.objeto && e.proceso === existente.proceso;
                resultado.push({ tipo, sentido, legal: false, motivo: v, ...(mismoPar ? { alternativa: alternativa(m, e, existente) } : {}) });
            } else resultado.push({ tipo, sentido, legal: true, candidato: completo.valor, avisos });
        }
    const rango = (o: OpcionTipo) => o.legal === true ? 0 : o.legal === 'pendiente' ? 1 : 2;
    return resultado.sort((a, b) => rango(a) - rango(b) || MATRIZ[a.tipo].menu - MATRIZ[b.tipo].menu);
}
export function erroresContexto(m: Modelo): readonly Violacion[] {
    return [...Object.values(m.enlaces).flatMap(e => contexto(m, e, true)), ...Object.values(m.abanicos).flatMap(f => violacionesAbanico(m, f))];
}
