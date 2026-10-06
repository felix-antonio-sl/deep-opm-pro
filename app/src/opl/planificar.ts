import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
import type { DiagOpl } from './analizar';
// ---------- Planificación y aplicación ----------
export type TipoPatch = 'crear-entidad' | 'traer-entidad' | 'cambiar-esencia' | 'cambiar-afiliacion' | 'sincronizar-estados' | 'aplicar-designacion-estado' | 'fijar-valor' | 'fijar-cota' | 'crear-refinamiento' | 'fijar-orden' | 'fijar-incompleta' | 'crear-enlace' | 'ajustar-enlace' | 'fijar-etiqueta-enlace' | 'crear-abanico' | 'renombrar-entidad' | 'renombrar-estado';
export interface Patch {
    readonly p: TipoPatch;
    readonly fase: 1 | 2 | 3; // 1 no-enlace · 2 enlace y cota · 3 abanico (R-OPL-EDIT-5, T-181)
    readonly clave: string; // clave de hecho: detecta conflicto-patches (T-178)
    readonly acciones: readonly Accion[]; // operaciones del núcleo, con los ids que asignó el ensayo
    readonly descripcion: string; // «crear objeto **Cliente**», «crear enlace consumo» (R-OPL-EDIT-1)
}
export type EstadoLinea = 'ignorada-vacia' | 'aplicable' | 'no-aplicable' | 'sin-cambio'; // T-174
export type RazonNoAplicable = 'forma-no-reconocida' | 'entidad-no-existe' | 'referencia-ambigua' | 'enlace-invalido-firma' | 'conflicto-patches' | 'inversa-no-soportada' | 'puntuacion-faltante' | 'cambio-ya-presente'; // T-176: cerrado
export interface LineaPlan {
    readonly numero: number;
    readonly texto: string;
    readonly estado: EstadoLinea;
    readonly patches: readonly Patch[];
    readonly diagnosticos: readonly DiagOpl[];
    readonly razon?: RazonNoAplicable; // solo si no-aplicable; o 'cambio-ya-presente'/'inversa-no-soportada' como detalle de sin-cambio
    readonly detalle: string; // texto visible de la canaleta
}
export interface ResumenPlan {
    readonly total: number;
    readonly aplicables: number;
    readonly noAplicables: number;
    readonly ignoradas: number;
    readonly sinCambio: number;
}
export interface Plan {
    readonly base: Modelo; // identidad del modelo planificado
    readonly alcance: Id | 'modelo';
    readonly lineas: readonly LineaPlan[];
    readonly resumen: ResumenPlan;
    readonly acciones: readonly Accion[]; // de las líneas aplicables, en orden de fases
    readonly notas: readonly DiagOpl[]; // no-delete-by-absence (info, T-172)
}

import { generarBloque, generarModelo, textoCanonico } from './generar';
import { analizar } from './analizar';
import type { LineaAnalizada, HechoTexto, EnlaceTexto, ExtremoTexto, NombreTipado } from './analizar';
import { aplicarAccion } from '../nucleo/operaciones';
import { indice, claveNombre } from '../nucleo/indice';
import { proyectar } from '../nucleo/proyeccion';
import { extremos, esProcedimental } from '../nucleo/tipos';
import type { EnlaceNuevo, Enlace, Cosa, Opd, ModoDespliegue } from '../nucleo/tipos';

export const TEXTO_RAZON: Readonly<Record<RazonNoAplicable, string>> = Object.freeze({
    'forma-no-reconocida': 'Forma OPL no reconocida', 'entidad-no-existe': 'La entidad referida no existe en el modelo',
    'referencia-ambigua': 'Más de una entidad con ese nombre', 'enlace-invalido-firma': 'Firma de enlace inválida',
    'conflicto-patches': 'Cambios incompatibles sobre el mismo hecho', 'inversa-no-soportada': 'Edición inversa no soportada / las líneas ausentes no borran hechos',
    'puntuacion-faltante': 'La oración OPL-ES debe terminar en punto', 'cambio-ya-presente': 'Este cambio ya está aplicado al modelo'
});
class Fallo {
    constructor(readonly codigo: DiagOpl['codigo'], readonly mensaje: string, readonly regla?: string) {}
}
const razon = (d: DiagOpl): RazonNoAplicable => d.codigo === 'unknown-symbol' ? 'entidad-no-existe' : d.codigo === 'ambiguous-symbol' ? 'referencia-ambigua' : d.codigo === 'type-mismatch' ? 'enlace-invalido-firma' : d.codigo === 'patch-conflict' ? 'conflicto-patches' : d.codigo === 'unsupported-canonical' ? 'inversa-no-soportada' : /punto/.test(d.mensaje) ? 'puntuacion-faltante' : 'forma-no-reconocida';
const memoContenido = new WeakMap<object,string>();
function estable(v:unknown):string {
    const objeto=v!==null&&typeof v==='object';
    const previo=objeto?memoContenido.get(v):undefined;if(previo!==undefined)return previo;
    const serializar=(x:unknown):string|undefined=>{
        if(x===null||typeof x!=='object')return JSON.stringify(x);
        if(Array.isArray(x))return '['+x.map(y=>serializar(y)??'null').join(',')+']';
        const c=x as Record<string,unknown>,partes:string[]=[];
        for(const k of Object.keys(c).sort()){const valor=serializar(c[k]);if(valor!==undefined)partes.push(JSON.stringify(k)+':'+valor);}
        return '{'+partes.join(',')+'}';
    };
    const texto=serializar(v)!;
    if(objeto&&Object.isFrozen(v))memoContenido.set(v,texto);return texto;
}
function claveHecho(h: HechoTexto): string | null {
    const n = (s: string) => claveNombre(s);
    switch (h.k) {
        case 'esencia': case 'afiliacion': return `${h.k}:${n(h.cosa.nombre)}`;
        case 'designacion': return `designacion:${n(h.objeto)}:${n(h.estado)}`;
        case 'valor': return `valor:${n(h.atributo)}`;
        case 'cota': return `cota:${n(h.proceso)}:${h.campo}`;
        case 'descomposicion': return `descomposicion:${n(h.proceso)}`;
        case 'enlace': {
            const e = h.enlace as EnlaceTexto & {control?:Control; ruta?:string; mult?:Multiplicidad};
            const {control,ruta,...base}=e; void control; void ruta;
            const quitarMult=(x:unknown):unknown=>x&&typeof x==='object'?Object.fromEntries(Object.entries(x).filter(([k])=>k!=='mult'&&k!=='genero').map(([k,v])=>[k,quitarMult(v)])):x;
            return `enlace:${estable(quitarMult(base))}`;
        }
        case 'abanico': return `abanico:${estable(h.ramas)}`;
        default: return null;
    }
}
function entidades(h: HechoTexto): NombreTipado[] {
    switch (h.k) {
        case 'mencion': case 'esencia': case 'afiliacion': case 'incompleta': return [h.cosa];
        case 'estados': case 'designacion': return [{ nombre: h.objeto, tipo: 'objeto' }];
        case 'valor': return [h.atributo, h.exhibidor].map(nombre => ({ nombre, tipo: 'objeto' as const }));
        case 'cota': return [{ nombre: h.proceso, tipo: 'proceso' }];
        case 'enlace': return cosasEnlace(h.enlace);
        case 'abanico': return h.ramas.flatMap(cosasEnlace);
        default: return [];
    }
}
function cosasEnlace(e: EnlaceTexto): NombreTipado[] {
    if ('objeto' in e) return [e.objeto, { nombre: e.proceso, tipo: 'proceso' }];
    if ('refinable' in e) return [e.refinable, e.refinador];
    if (typeof e.origen === 'string') return [{ nombre: e.origen, tipo: 'proceso' }, { nombre: e.destino as string, tipo: 'proceso' }];
    return [e.origen, e.destino as ExtremoTexto];
}
interface Trabajo { l: LineaAnalizada; hechos: readonly HechoTexto[]; etiqueta: string; }
export function planificar(m: Modelo, alcance: Id | 'modelo', texto: string): Plan {
    const ls = analizar(texto), trabajos: Trabajo[] = []; let etiqueta = alcance === 'modelo' ? 'SD' : indice(m).etiqueta.get(alcance) ?? alcance;
    const canonico=textoCanonico(alcance === 'modelo' ? generarModelo(m) : generarBloque(m,alcance));
    let previo:readonly LineaAnalizada[]|undefined;const anterior=()=>previo??(previo=analizar(canonico));
    const superficies = (lineas: readonly LineaAnalizada[]) => lineas.filter(l=>!l.vacia&&!/^# /.test(l.texto)).map(l=>l.texto).join('\n');
    // Identidad textual canónica acreditada: no hay ensayo ni ID que asignar.
    if (ls.every(l=>!l.diagnosticos.length) && (superficies(ls)===canonico||superficies(ls)===superficies(anterior()))) {
        const lineas:LineaPlan[]=ls.map(l=>({numero:l.numero,texto:l.texto,estado:l.vacia?'ignorada-vacia':'sin-cambio',patches:[],diagnosticos:[],...(l.vacia?{}:{razon:'cambio-ya-presente' as const}),detalle:l.vacia?'':TEXTO_RAZON['cambio-ya-presente']}));
        return {base:m,alcance,lineas,acciones:[],notas:[],resumen:{total:ls.length,aplicables:0,noAplicables:0,ignoradas:ls.filter(l=>l.vacia).length,sinCambio:ls.filter(l=>!l.vacia).length}};
    }
    const pares = new Map<number, number>();
    const diags = new Map<number, DiagOpl[]>(), prohibidas = new Set<number>();
    const diagnosticar = (numero: number, d: DiagOpl) => { diags.set(numero, [...(diags.get(numero) ?? []), d]); if (d.severidad === 'error' || d.codigo === 'unsupported-canonical') prohibidas.add(numero); };
    for (const l of ls) {
        if (l.cabecera) etiqueta = l.cabecera;
        l.diagnosticos.forEach(d => diagnosticar(l.numero, d)); trabajos.push({ l, hechos: l.hechos, etiqueta });
    }
    // Registro independiente del ensayo: un conflicto excluye AMBAS líneas y todas sus acciones.
    const registros = new Map<string, { numero: number; contenido: string }[]>();
    for (const t of trabajos) for (const h of t.hechos) {
        let k = claveHecho(h); if (!k) continue;
        if (h.k === 'cota') { const ex=t.hechos.find((x):x is Extract<HechoTexto,{k:'enlace'}>=>x.k==='enlace'&&(x.enlace.tipo==='excepcionSobretiempo'||x.enlace.tipo==='excepcionSubtiempo')); if(ex)k+=`:${estable(ex.enlace)}`; }
        const previos = registros.get(k) ?? [], contenido = estable(h);
        for (const p of previos) if (p.contenido !== contenido) for (const numero of [p.numero, t.l.numero]) if (!prohibidas.has(numero)) diagnosticar(numero, { codigo: 'patch-conflict', severidad: 'error', linea: numero, mensaje: 'Cambios incompatibles sobre el mismo hecho.' });
        registros.set(k, [...previos, { numero: t.l.numero, contenido }]);
    }
    // Dos oraciones dirigidas opuestas del mismo bloque son UN hecho bidireccional.
    for (let i = 0; i < trabajos.length; i++) {
        const a = trabajos[i]!, ea = a.hechos.length === 1 && a.hechos[0]?.k === 'enlace' ? a.hechos[0].enlace : null;
        if (!ea || ea.tipo !== 'etiquetado' || typeof ea.origen === 'string') continue;
        for (let j = i + 1; j < trabajos.length; j++) {
            const b = trabajos[j]!, eb = b.hechos.length === 1 && b.hechos[0]?.k === 'enlace' ? b.hechos[0].enlace : null;
            if (b.etiqueta !== a.etiqueta || !eb || eb.tipo !== 'etiquetado' || typeof eb.origen === 'string') continue;
            if (claveNombre(ea.origen.nombre) === claveNombre(eb.destino.nombre) && claveNombre(ea.destino.nombre) === claveNombre(eb.origen.nombre) && ea.origen.estado === eb.destino.estado && ea.destino.estado === eb.origen.estado) {
                a.hechos = [{ k: 'enlace', enlace: { ...ea, tipo: ea.etiqueta === eb.etiqueta ? 'reciproco' : 'etiquetadoBidireccional', ...(ea.etiqueta !== eb.etiqueta ? { inversa: eb.etiqueta } : {}) } }];
                b.hechos = []; pares.set(b.l.numero,a.l.numero); break;
            }
        }
    }
    let patches = new Map<number, Patch[]>(), acciones: Accion[] = [];
    // Cada fallo quita la línea ENTERA y vuelve a ensayar desde la misma base; no reserva IDs.
    for (;;) {
        let actual = m, falla: { numero: number; error: Fallo } | null = null;
        patches = new Map(); acciones = [];
        const labels = new Map([...indice(m).etiqueta].map(([id, e]) => [e, id]));
        const agregar = (t: Trabajo, a: Accion, p: TipoPatch, fase: 1 | 2 | 3, clave: string) => {
            const r = aplicarAccion(actual, a);
            if (!r.ok) throw new Fallo(r.rechazo.codigo === 'no-ofrecido' ? 'unsupported-canonical' : r.rechazo.codigo === 'referencia-ambigua' || r.rechazo.codigo === 'unicidad-nominal' ? 'ambiguous-symbol' : 'type-mismatch', r.rechazo.mensaje, r.rechazo.regla);
            actual = r.valor.modelo; acciones.push(a);
            patches.set(t.l.numero, [...(patches.get(t.l.numero) ?? []), { p, fase, clave, acciones: [a], descripcion: `${p}: ${clave}` }]);
            return r.valor.creados;
        };
        const oid = (t: Trabajo): string => {
            const o = labels.get(t.etiqueta); if (!o) throw new Fallo('unknown-symbol', `OPD ${t.etiqueta} no existe.`); return o;
        };
        const buscar = (n: NombreTipado): Cosa | undefined => {
            const cs = (indice(actual).porClaveNombre.get(claveNombre(n.nombre)) ?? []).map(id => actual.cosas[id]!);
            if (cs.length > 1) throw new Fallo('ambiguous-symbol', `Más de una entidad con el nombre ${n.nombre}.`);
            if (cs[0] && cs[0].tipo !== n.tipo) throw new Fallo('type-mismatch', `La tipografía de ${n.nombre} contradice su tipo.`, 'R-IMPORT-7');
            return cs[0];
        };
        const asegurar = (t: Trabajo, n: NombreTipado, o = oid(t)): string => {
            let c = buscar(n);
            if (!c) {
                const ids = agregar(t, { op: 'crearCosa', args: { opd: o, tipo: n.tipo, nombre: n.nombre, x: 0, y: 0, alcance: 'externo' } }, 'crear-entidad', 1, claveNombre(n.nombre));
                c = actual.cosas[ids[0]!]!;
            }
            if (!actual.opds[o]!.apariciones[c.id] && !proyectar(actual, o).cosas.some(v => v.cosa === c!.id)) agregar(t, { op: 'traerCosa', args: { opd: o, cosa: c.id, x: 0, y: 0 } }, 'traer-entidad', 1, c.id);
            if ('genero' in n && n.genero === 'f' && c.genero !== 'f') agregar(t, { op: 'fijarGenero', args: { cosa: c.id, genero: 'f' } }, 'crear-entidad', 1, `${c.id}:genero`);
            return c.id;
        };
        const estado = (t: Trabajo, objeto: string, nombre: string): string => {
            const id = asegurar(t, { nombre: objeto, tipo: 'objeto' }), c = actual.cosas[id]!;
            if (c.tipo !== 'objeto') throw new Fallo('type-mismatch', 'Sólo un objeto tiene estados.');
            const s = c.estados.filter(s => claveNombre(s.nombre) === claveNombre(nombre));
            if (s.length > 1) throw new Fallo('ambiguous-symbol', `Estado ${nombre} ambiguo.`);
            return s[0]?.id ?? agregar(t, { op: 'agregarEstado', args: { objeto: id, nombre } }, 'sincronizar-estados', 1, `${id}:${claveNombre(nombre)}`)[0]!;
        };
        const candidato = (t: Trabajo, e: EnlaceTexto): EnlaceNuevo => {
            const id = (n: NombreTipado) => asegurar(t, n), st = (n: ExtremoTexto) => n.estado ? estado(t, n.nombre, n.estado) : undefined;
            if ('objeto' in e) {
                const objeto = id(e.objeto), proceso = id({ nombre: e.proceso, tipo: 'proceso' });
                const base = { tipo: e.tipo, objeto, proceso, ...(e.objeto.mult ? { mult: e.objeto.mult } : {}), ...(e.control ? { control: e.control } : {}) };
                if (e.tipo === 'efecto') return { ...base, tipo: e.tipo, ...(e.entrada ? { entrada: estado(t, e.objeto.nombre, e.entrada) } : {}), ...(e.salida ? { salida: estado(t, e.objeto.nombre, e.salida) } : {}) };
                const es = st(e.objeto);
                return { ...base, tipo: e.tipo, ...(es ? { estado: es } : {}), ...(e.ruta ? { ruta: e.ruta } : {}) };
            }
            if ('refinable' in e) return { tipo: e.tipo, refinable: id(e.refinable), refinador: id(e.refinador), ...(e.tipo === 'agregacion' && e.refinador.mult ? { mult: e.refinador.mult } : {}), ...(e.tipo === 'generalizacion' && e.refinable.estado && e.refinador.estado ? { estados: { general: st(e.refinable)!, especializacion: st(e.refinador)! } } : {}) };
            if (e.tipo === 'invocacion' || e.tipo === 'excepcionSobretiempo' || e.tipo === 'excepcionSubtiempo') return { tipo: e.tipo, origen: id({ nombre: e.origen, tipo: 'proceso' }), destino: id({ nombre: e.destino as string, tipo: 'proceso' }) };
            if (!('etiqueta' in e) && typeof e.origen === 'string') throw new Fallo('type-mismatch', 'Extremos tipados requeridos.');
            const et = e as Extract<EnlaceTexto, { tipo: 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco' }>;
            const etiqueta = et.tipo === 'etiquetado' && et.etiqueta === 'se relaciona con' ? undefined : et.etiqueta;
            const dest = et.destino, origen = id(et.origen), destino = id(dest), so = st(et.origen), sd = st(dest);
            const b = { origen, destino, ...(etiqueta ? { etiqueta } : {}), ...(et.origen.mult ? { multOrigen: et.origen.mult } : {}), ...(dest.mult ? { multDestino: dest.mult } : {}) };
            if (e.tipo === 'reciproco') return { ...b, tipo: e.tipo, ...(so ? { estados: { origen: so, ...(sd ? { destino: sd } : {}) } } : {}) };
            if (e.tipo === 'etiquetadoBidireccional') return { ...b, tipo: e.tipo, etiqueta: e.etiqueta!, inversa: e.inversa!, ...(so ? { estadoOrigen: so } : {}) };
            return { ...b, tipo: 'etiquetado', ...(so ? { estadoOrigen: so } : {}), ...(sd ? { estadoDestino: sd } : {}) };
        };
        const identidadEnlace = (e: Enlace | EnlaceNuevo) => {
            const {id,control,ruta,mult,multOrigen,multDestino,escision,...identidad}=e as Enlace & {control?:Control;ruta?:string;mult?:Multiplicidad;multOrigen?:Multiplicidad;multDestino?:Multiplicidad;escision?:unknown};
            void id;void control;void ruta;void mult;void multOrigen;void multDestino;void escision;return estable(identidad);
        };
        const mismaPareja = (a: Enlace | EnlaceNuevo, b: EnlaceNuevo): boolean => identidadEnlace(a) === identidadEnlace(b);
        const comparable = (e: Enlace | EnlaceNuevo) => { const { id, escision, ...n } = e as Enlace & { escision?: unknown }; void id; void escision; return estable(n); };
        const enlace = (t: Trabajo, c: EnlaceNuevo, abanicoCon?: {enlace:Id;operador:Operador}): string => {
            const o = oid(t), vistos = proyectar(actual, o).enlaces;
            const completo = vistos.find(v => comparable(v.enlace) === comparable(c));
            if (completo) return completo.enlace.id;
            const originales = Object.values(actual.enlaces).filter(e => mismaPareja(e, c));
            const exacto = originales.find(e => comparable(e) === comparable(c));
            if (exacto) return exacto.id;
            const viejo = originales.length === 1 ? originales[0] : undefined;
            if (viejo) {
                const st = 'objeto' in c ? c.tipo === 'efecto' ? { entrada: c.entrada ?? null, salida: c.salida ?? null } : { estado: c.estado ?? null } : c.tipo === 'generalizacion' ? { generalizacion: c.estados ?? null } : c.tipo === 'etiquetado' ? { origen: c.estadoOrigen ?? null, destino: c.estadoDestino ?? null } : c.tipo === 'etiquetadoBidireccional' ? { origen: c.estadoOrigen ?? null, destino: null } : c.tipo === 'reciproco' ? { origen: c.estados?.origen ?? null, destino: c.estados?.destino ?? null } : null;
                if (st) agregar(t, { op: 'fijarEstados', args: { enlace: viejo.id, estados: st } }, 'ajustar-enlace', 2, viejo.id);
                if ('objeto' in c && c.tipo !== 'resultado' && (viejo as typeof c).control !== c.control) agregar(t, { op: 'fijarControl', args: { enlace: viejo.id, control: c.control ?? null } }, 'ajustar-enlace', 2, viejo.id);
                if ((c.tipo === 'consumo' || c.tipo === 'resultado') && (viejo as typeof c).ruta !== c.ruta) agregar(t, { op: 'fijarRuta', args: { enlace: viejo.id, ruta: c.ruta ?? null } }, 'ajustar-enlace', 2, viejo.id);
                if ('objeto' in c && (viejo as typeof c).mult !== c.mult) agregar(t, { op: 'fijarMultiplicidad', args: { enlace: viejo.id, extremo: 'objeto', valor: c.mult ?? null } }, 'ajustar-enlace', 2, viejo.id);
                if (c.tipo === 'agregacion' && (viejo as typeof c).mult !== c.mult) agregar(t, { op: 'fijarMultiplicidad', args: { enlace: viejo.id, extremo: 'refinador', valor: c.mult ?? null } }, 'ajustar-enlace', 2, viejo.id);
                if (['etiquetado', 'etiquetadoBidireccional', 'reciproco'].includes(c.tipo)) {
                    const x = c as Extract<EnlaceNuevo, { origen: string }> & { etiqueta?: string; inversa?: string; multOrigen?: Multiplicidad; multDestino?: Multiplicidad };
                    if ((viejo as typeof x).etiqueta !== x.etiqueta || (viejo as typeof x).inversa !== x.inversa) agregar(t, { op: 'fijarEtiqueta', args: { enlace: viejo.id, etiqueta: x.etiqueta ?? null, ...(x.inversa ? { inversa: x.inversa } : {}) } }, 'fijar-etiqueta-enlace', 2, viejo.id);
                    for (const extremo of ['origen', 'destino'] as const) { const campo = extremo === 'origen' ? 'multOrigen' : 'multDestino'; if ((viejo as typeof x)[campo] !== x[campo]) agregar(t, { op: 'fijarMultiplicidad', args: { enlace: viejo.id, extremo, valor: x[campo] ?? null } }, 'ajustar-enlace', 2, viejo.id); }
                }
                return viejo.id;
            }
            return agregar(t, { op: 'crearEnlace', args: { opd: o, candidato: c, ...(abanicoCon?{abanicoCon}:{}) } }, 'crear-enlace', 2, estable(c))[0]!;
        };
        const activos = trabajos.filter(t => !prohibidas.has(t.l.numero));
        const intentar = (t: Trabajo, fn: () => void) => { if (falla) return; try { fn(); } catch (e) { if (!(e instanceof Fallo)) throw e; falla = { numero: t.l.numero, error: e }; } };
        // Contexto en preorden, antes de crear nombres que son internos de un hijo.
        for (const t of [...activos].sort((a, b) => a.etiqueta.split('.').length - b.etiqueta.split('.').length || a.l.numero - b.l.numero)) for (const h of t.hechos) if (h.k === 'descomposicion' || h.k === 'despliegue') intentar(t, () => {
            const padreLabel = h.k === 'descomposicion' && h.opdPadre ? h.opdPadre : t.etiqueta.includes('.') ? t.etiqueta.slice(0, t.etiqueta.lastIndexOf('.')) : 'SD';
            const padre = labels.get(padreLabel); if (!padre) throw new Fallo('unknown-symbol', `OPD padre ${padreLabel} inexistente.`);
            const n = h.k === 'descomposicion' ? { nombre: h.proceso, tipo: 'proceso' as const } : h.cosa;
            const c = asegurar(t, n, padre);
            let d = Object.values(actual.opds).find(o => o.tipo !== 'raiz' && o.cosa === c && (h.k === 'descomposicion' ? o.tipo === 'descomposicion' : o.tipo === 'despliegue'));
            if (!d && h.k === 'descomposicion') {
                for (const n of h.bandas.flat()) if (buscar({ nombre: n, tipo: 'proceso' })) throw new Fallo('ambiguous-symbol', `${n} no es subproceso de ${h.proceso}.`, 'R-IMPORT-7');
                const ids = agregar(t, { op: 'descomponer', args: { opd: padre, proceso: c, bandas: h.bandas } }, 'crear-refinamiento', 1, c);
                d = actual.opds[ids.find(id => actual.opds[id])!]!;
            } else if (!d && h.k === 'despliegue') {
                const tipos = new Set(activos.flatMap(x => x.hechos).filter((x): x is Extract<HechoTexto, { k: 'enlace' }> => x.k === 'enlace').map(x => x.enlace).filter(e => 'refinable' in e && claveNombre(e.refinable.nombre) === claveNombre(n.nombre) && h.refinadores.some(r => claveNombre(r.nombre) === claveNombre(e.refinador.nombre))).map(e => e.tipo));
                if (tipos.size !== 1) throw new Fallo('ambiguous-symbol', 'El despliegue requiere una relación fundamental inequívoca.');
                const modo = [...tipos][0] as ModoDespliegue;
                const ids = agregar(t, { op: 'desplegar', args: { opd: padre, cosa: c, modo } }, 'crear-refinamiento', 1, c); d = actual.opds[ids[0]!]!;
                for (const r of h.refinadores) if (!buscar(r)) agregar(t, { op: 'agregarRefinadores', args: { opd: d.id, nombres: [r.nombre], tipo: r.tipo } }, 'crear-refinamiento', 1, c);
            }
            if (!d || d.tipo === 'raiz') throw new Fallo('type-mismatch', 'Contexto de refinamiento inválido.');
            const esperado = h.opdHijo ?? t.etiqueta;
            const labelReal = indice(actual).etiqueta.get(d.id)!;
            if (esperado !== 'SD' && esperado !== labelReal) throw new Fallo('unknown-symbol', `Etiqueta ${esperado} no corresponde a ${labelReal}.`);
            labels.set(labelReal, d.id);
            if (h.k === 'descomposicion' && d.tipo === 'descomposicion') {
                const originales = new Set(d.bandas.flat());
                for (const b of h.bandas) for (const n of b) { const p = buscar({ nombre: n, tipo: 'proceso' }); if (p && !originales.has(p.id)) throw new Fallo('ambiguous-symbol', `${n} no pertenece a ${h.proceso}.`); }
                const nuevos = h.bandas.flat().filter(n => !buscar({ nombre: n, tipo: 'proceso' }));
                if (nuevos.length) agregar(t, { op: 'agregarSubprocesos', args: { opd: d.id, bandas: nuevos.map(n => [n]), posicion: 'final' } }, 'crear-refinamiento', 1, c);
                const bands = h.bandas.map(b => b.map(n => buscar({ nombre: n, tipo: 'proceso' })!.id));
                if (bands.flat().length !== (actual.opds[d.id] as Extract<Opd, {tipo:'descomposicion'}>).bandas.flat().length) throw new Fallo('unsupported-canonical', 'La ausencia de subprocesos no los elimina.', 'R-§19-LENS-1');
                const particionCanonica = (bs: readonly (readonly string[])[]) => estable(bs.map(b => [...b].sort()));
                if (particionCanonica((actual.opds[d.id] as Extract<Opd, {tipo:'descomposicion'}>).bandas) !== particionCanonica(bands)) agregar(t, { op: 'fijarBandas', args: { opd: d.id, bandas: bands } }, 'fijar-orden', 1, c);
                for (const n of h.internos) if (!buscar({ nombre: n, tipo: 'objeto' })) agregar(t, { op: 'crearCosa', args: { opd: d.id, tipo: 'objeto', nombre: n, x: 0, y: 0, alcance: 'interno' } }, 'crear-entidad', 1, n);
            }
        });
        for (const t of activos) intentar(t, () => {
            if (t.l.cabecera && !labels.has(t.l.cabecera)) throw new Fallo('unknown-symbol', `OPD ${t.l.cabecera} no existe.`);
            for (const h of t.hechos) {
                if (h.k === 'descomposicion' || h.k === 'despliegue') continue;
                for (const n of entidades(h)) asegurar(t, n);
                if (h.k === 'estados') for (const n of h.nombres) estado(t, h.objeto, n);
                if (h.k === 'designacion') {
                    const id = estado(t, h.objeto, h.estado), owner = actual.cosas[indice(actual).estadoDe.get(id)!.objeto]!;
                    if (owner.tipo !== 'objeto') throw new Fallo('type-mismatch', 'Estado sin objeto.');
                    for (const d of h.designaciones) if (d === 'inicial' || d === 'final' ? !owner.estados.find(s => s.id === id)![d] : owner[d] !== id) agregar(t, { op: 'designar', args: { estado: id, designacion: d, activa: true } }, 'aplicar-designacion-estado', 1, id + ':' + d);
                }
                if (h.k === 'esencia' || h.k === 'afiliacion') {
                    const id = asegurar(t, h.cosa);
                    if ((t.l.plantilla === 'D1' || t.l.plantilla === 'D4') && !h.cosa.genero && actual.cosas[id]!.genero === 'f') agregar(t,{op:'fijarGenero',args:{cosa:id,genero:'m'}},'crear-entidad',1,`${id}:genero`);
                    if (actual.cosas[id]![h.k] !== h.valor) agregar(t, h.k === 'esencia' ? { op: 'fijarEsencia', args: { cosa: id, esencia: h.valor } } : { op: 'fijarAfiliacion', args: { cosa: id, afiliacion: h.valor } }, h.k === 'esencia' ? 'cambiar-esencia' : 'cambiar-afiliacion', 1, id + ':' + h.k);
                }
                if (h.k === 'incompleta') { const id = asegurar(t, h.cosa); if (!actual.cosas[id]!.incompleta?.includes(h.relacion)) agregar(t, { op: 'fijarIncompleta', args: { cosa: id, relacion: h.relacion, activa: true } }, 'fijar-incompleta', 1, id); }
                for (const e of h.k === 'enlace' ? [h.enlace] : h.k === 'abanico' ? h.ramas : []) {
                    if ('objeto' in e) { if (e.objeto.estado) estado(t, e.objeto.nombre, e.objeto.estado); if (e.tipo === 'efecto') { if (e.entrada) estado(t, e.objeto.nombre, e.entrada); if (e.salida) estado(t, e.objeto.nombre, e.salida); } }
                    if ('refinable' in e) { if (e.refinable.estado) estado(t, e.refinable.nombre, e.refinable.estado); if (e.refinador.estado) estado(t, e.refinador.nombre, e.refinador.estado); }
                    if ('origen' in e && typeof e.origen !== 'string') { if (e.origen.estado) estado(t, e.origen.nombre, e.origen.estado); if (typeof e.destino !== 'string' && e.destino.estado) estado(t, e.destino.nombre, e.destino.estado); }
                }
            }
        });
        // «Otros» suprime localmente los estados omitidos, sin eliminar su identidad nuclear.
        for (const t of activos) intentar(t,()=>{for(const h of t.hechos)if(h.k==='estados'){
            const id=asegurar(t,{nombre:h.objeto,tipo:'objeto'}),c=actual.cosas[id]!,o=oid(t);
            if(c.tipo!=='objeto')throw new Fallo('type-mismatch','Sólo un objeto tiene estados.');
            const nombres=new Set(h.nombres.map(claveNombre));
            for(const s of c.estados){const nombrado=nombres.has(claveNombre(s.nombre));if(!nombrado&&!h.otros)continue;const oculta=!nombrado;
                if(Boolean(actual.opds[o]!.apariciones[id]?.ocultos?.includes(s.id))!==oculta) agregar(t,{op:'suprimirEstado',args:{estado:s.id,opd:o,activa:oculta}},'sincronizar-estados',1,`${id}:${s.id}:visible`);
            }
        }});
        // Hijos primero: el padre puede reutilizar sus hechos proyectados.
        for (const t of [...activos].sort((a, b) => b.etiqueta.split('.').length - a.etiqueta.split('.').length || a.l.numero - b.l.numero)) intentar(t, () => {
            for (const h of t.hechos) {
                if (h.k === 'enlace') enlace(t, candidato(t, h.enlace));
                if (h.k === 'abanico') {
                    let primero:Id|undefined;
                    const cs=h.ramas.map(e=>candidato(t,e));
                    const mismoPar=cs.every(c=>'objeto' in c&&'objeto' in cs[0]!&&c.objeto===cs[0]!.objeto&&c.proceso===(cs[0] as Extract<EnlaceNuevo,{objeto:Id}>).proceso);
                    for(const c of cs){const id=enlace(t,c,mismoPar&&primero?{enlace:primero,operador:h.operador}:undefined);primero??=id;}
                }
                if (h.k === 'valor') {
                    const atributo = asegurar(t, { nombre: h.atributo, tipo: 'objeto' }), exhibidor = asegurar(t, { nombre: h.exhibidor, tipo: 'objeto' });
                    enlace(t, { tipo: 'exhibicion', refinable: exhibidor, refinador: atributo });
                    const c = actual.cosas[atributo]!; if (c.tipo === 'objeto' && c.valor !== h.valor) agregar(t, { op: 'fijarValor', args: { objeto: atributo, valor: h.valor } }, 'fijar-valor', 2, atributo);
                }
                if (h.k === 'cota') {
                    let id = asegurar(t, { nombre: h.proceso, tipo: 'proceso' });
                    const ex = t.hechos.find((x): x is Extract<HechoTexto, {k:'enlace'}> => x.k === 'enlace' && (x.enlace.tipo === 'excepcionSobretiempo' || x.enlace.tipo === 'excepcionSubtiempo'));
                    if (ex && 'origen' in ex.enlace && typeof ex.enlace.origen === 'string') {
                        const destinoTexto=ex.enlace.destino as string;
                        const visto = proyectar(actual, oid(t)).enlaces.find(v => v.enlace.tipo === ex.enlace.tipo && 'origen' in v.enlace && v.enlace.origen === id && v.enlace.destino === buscar({nombre:destinoTexto,tipo:'proceso'})?.id);
                        const fuentes = visto?.hechos.map(eid => actual.enlaces[eid]!).filter((e): e is Extract<Enlace, { tipo:'excepcionSobretiempo' | 'excepcionSubtiempo' }> => e.tipo === 'excepcionSobretiempo' || e.tipo === 'excepcionSubtiempo').map(e => e.origen) ?? [];
                        if (new Set(fuentes).size === 1) id = fuentes[0]!;
                    }
                    const c = actual.cosas[id]!; if (c.tipo !== 'proceso') throw new Fallo('type-mismatch', 'Cota sin proceso.');
                    if (c.duracion?.[h.campo] !== h.n || (c.duracion?.unidad ?? actual.unidadTiempo) !== h.unidad) agregar(t, { op: 'fijarDuracion', args: { proceso: id, duracion: { ...c.duracion, [h.campo]: h.n, unidad: h.unidad } } }, 'fijar-cota', 2, id + ':' + h.campo);
                }
            }
        });
        for (const t of activos) intentar(t, () => { for (const h of t.hechos) if (h.k === 'abanico') {
            const ids = h.ramas.map(e => enlace(t, candidato(t, e)));
            const existente = Object.values(actual.abanicos).find(f => f.enlaces.length === ids.length && f.enlaces.every(id => ids.includes(id)));
            if (existente) { if (existente.operador !== h.operador) agregar(t, { op: 'fijarOperador', args: { abanico: existente.id, operador: h.operador } }, 'crear-abanico', 3, existente.id); }
            else agregar(t, { op: 'formarAbanico', args: { enlaces: ids, operador: h.operador } }, 'crear-abanico', 3, ids.join(','));
        } });
        if (!falla) break;
        const f = falla as {numero:number;error:Fallo};
        diagnosticar(f.numero, { codigo: f.error.codigo, severidad: f.error.codigo === 'unsupported-canonical' ? 'warning' : 'error', linea: f.numero, mensaje: f.error.mensaje, ...(f.error.regla ? { regla: f.error.regla } : {}) });
    }
    const lineas: LineaPlan[] = ls.map(l => {
        const par = pares.get(l.numero);
        const ds = diags.get(l.numero) ?? (par ? diags.get(par)?.map(d=>({...d,linea:l.numero})) : undefined) ?? [], ps = patches.get(l.numero) ?? [], psPar = par ? patches.get(par) ?? [] : [], error = ds.find(d => d.severidad === 'error'), unsupported = ds.find(d => d.codigo === 'unsupported-canonical');
        const estado: EstadoLinea = l.vacia ? 'ignorada-vacia' : error ? 'no-aplicable' : ps.length || psPar.length ? 'aplicable' : 'sin-cambio';
        const r = error ? razon(error) : unsupported ? 'inversa-no-soportada' : estado === 'sin-cambio' ? 'cambio-ya-presente' : undefined;
        return { numero: l.numero, texto: l.texto, estado, patches: ps, diagnosticos: ds, ...(r ? { razon: r } : {}), detalle: par ? `par de la línea ${par}` : ps.length ? ps.map(p => p.descripcion).join('; ') : r ? TEXTO_RAZON[r] : '' };
    });
    const resumen = { total: lineas.length, aplicables: 0, noAplicables: 0, ignoradas: 0, sinCambio: 0 };
    for (const l of lineas) resumen[l.estado === 'aplicable' ? 'aplicables' : l.estado === 'no-aplicable' ? 'noAplicables' : l.estado === 'ignorada-vacia' ? 'ignoradas' : 'sinCambio']++;
    const presentes = new Set(ls.flatMap(l=>l.hechos).map(estable));
    const previos = anterior().flatMap(l=>l.hechos);
    const ausencia = previos.some(h=>!presentes.has(estable(h)));
    return { base: m, alcance, lineas, resumen, acciones, notas: ausencia ? [{ codigo: 'no-delete-by-absence', severidad: 'info', linea: 0, mensaje: 'Las líneas ausentes no borran hechos.', regla: 'R-§19-LENS-1' }] : [] };
}
