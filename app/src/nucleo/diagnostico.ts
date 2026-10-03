import type { Modelo, Id, Ref, Enlace } from './tipos';
import { esProcedimental } from './tipos';
import type { Accion } from './operaciones';
import type { Rechazo } from './resultado';
import { indice, claveNombre } from './indice';
import { generales } from './herencia';
import { validarNombreCosa, validarNombreEstado, validarEtiqueta, sugerirNombre } from './lexico';
import { violacionesContexto, violacionesAbanico, REGLAS_CONTEXTO, noOfrecido } from './matriz';
import { proyectar } from './proyeccion';
export type Severidad = 'error' | 'warning' | 'info';
export type FamiliaDiagnostico = 'gramatical' | 'metodologica' | 'identidad' | 'contencion' | 'sugerencia';
export interface Diagnostico {
    readonly codigo: CodigoDiagnostico;
    readonly regla: string;
    readonly severidad: Severidad;
    readonly familia: FamiliaDiagnostico;
    readonly mensaje: string;
    readonly accion: string;
    readonly refs: readonly Ref[];
    readonly opd?: Id;
    readonly reparacion?: Accion;
}
export interface FilaCatalogo {
    readonly codigo: string;
    readonly regla: string;
    readonly severidad: Severidad;
    readonly familia: FamiliaDiagnostico;
    readonly accion: string;
}
type FilaRegistrada = FilaCatalogo & {
    readonly registro: 'B-30';
};
function fila<C extends string>(codigo: C, regla: string, severidad: Severidad, familia: FamiliaDiagnostico, accion: string) {
    return Object.freeze({ codigo, regla, severidad, familia, accion, registro: 'B-30' as const } satisfies FilaRegistrada);
}
export const CATALOGO = Object.freeze([
    fila('enlace-invalido', '§4.3.2', 'error', 'gramatical', 'Corrige el enlace conforme a la regla indicada'),
    fila('abanico-invalido', 'T-054, R-ZNC-COMB-1', 'error', 'gramatical', 'Corrige las ramas o disuelve el abanico'),
    fila('nombre-duplicado', 'T-024, AP-22', 'error', 'identidad', 'Usa un nombre canónico único'),
    fila('nombre-fuera-de-lexico', 'T-025, R-§18-LEX-1', 'error', 'gramatical', 'Renombra la cosa con un nombre léxico'),
    fila('estado-duplicado', 'T-015', 'error', 'identidad', 'Usa un nombre de estado único en su objeto'),
    fila('estado-fuera-de-lexico', 'T-025', 'error', 'gramatical', 'Renombra el estado con una palabra en minúscula'),
    fila('etiqueta-fuera-de-lexico', 'R-OPL-SE-1', 'error', 'gramatical', 'Usa una etiqueta o ruta léxica en minúscula'),
    fila('precedencia-invalida', 'AP-30, R-PREC-1', 'error', 'contencion', 'Corrige los resultados o consumos en el nivel hijo'),
    fila('conflicto-resultado-consumo', 'R-PREC-3/4', 'warning', 'contencion', 'Declara continuidad de identidad y estados en el nivel hijo'),
    fila('proceso-sin-transformacion', 'R-PROC-2, R-OPD-TR-8', 'warning', 'metodologica', 'Declara el objeto que consume, crea o afecta el proceso'),
    fila('subproceso-sin-transformado', 'método A3.1', 'warning', 'metodologica', 'Declara el objeto transformado por el subproceso'),
    fila('refinamiento-trivial', 'AP-13, R-REF-NTRIV-1/2', 'warning', 'contencion', 'Completa el refinamiento con al menos dos hijos'),
    fila('enlace-en-contorno-temporal', 'R-VIS-DIST-1', 'info', 'contencion', 'Agrega subprocesos y distribuye el enlace'),
    fila('opd-denso', 'R-LAY-1', 'warning', 'sugerencia', 'Reduce el detalle de este OPD mediante refinamiento'),
    fila('opd-sobrecargado', 'R-LAY-1, R-OPD-LAY-2', 'warning', 'sugerencia', 'Reduce este OPD a un máximo de 25 cosas'),
    fila('sd-sin-proceso-unico', 'R-SD-4, R-VIS-SD-1', 'warning', 'metodologica', 'Declara exactamente un proceso sistémico en el SD'),
    fila('manejador-no-ambiental', 'R-EXC-1A', 'warning', 'metodologica', 'Marca ambiental el manejador de excepción'),
    fila('cota-faltante', 'R-EXC-2/3, R-EXC-DUR-1', 'warning', 'metodologica', 'Declara la cota temporal exigida en el proceso fuente'),
    fila('afiliacion-incoherente', 'R-OBJ-6, R-OPD-STR-13, R-VIS-HER-2', 'warning', 'metodologica', 'Marca ambiental el rasgo del exhibidor ambiental'),
    fila('proceso-de-ambientales', 'R-OBJ-7', 'warning', 'metodologica', 'Revisa la afiliación del proceso ejecutado por cosas ambientales'),
    fila('refinador-en-varios-contextos', 'R-OPD-OP-6', 'warning', 'contencion', 'Aclara la pertenencia del refinador en sus contextos'),
    fila('general-redundante', 'R-OPD-VAL-6', 'info', 'sugerencia', 'Retira el enlace directo al general redundante'),
    fila('objeto-transiente', 'AP-26', 'warning', 'metodologica', 'Considera una invocación si no hay observación del objeto'),
    fila('nombre-proceso-largo', 'R-NOM-PROC-2', 'warning', 'metodologica', 'Usa un nombre de proceso de dos a cuatro palabras'),
    fila('nombre-proceso-no-deverbal', 'R-NOM-PROC-1', 'warning', 'metodologica', 'Usa una forma deverbal que exprese la acción o su resultado'),
    fila('nombre-objeto-plural', 'R-NOM-OBJ-1/2', 'warning', 'metodologica', 'Nombra el objeto singular o declara Conjunto o Grupo'),
    fila('nombre-estado-no-descriptivo', 'R-NOM-EST-1', 'warning', 'metodologica', 'Usa una forma pasiva o descriptiva del estado'),
    fila('etiqueta-larga', 'R-OPL-SE-1', 'info', 'gramatical', 'Usa una frase estructural breve'),
    fila('mezcla-infinitivo-nominalizacion', 'método A2.3', 'info', 'metodologica', 'Revisa la consistencia de la forma de los nombres de proceso'),
    fila('estado-sin-escritor', 'LF-19', 'info', 'metodologica', 'Declara el escritor o la caracterización del conjunto de estados'),
    fila('agente-humano', 'R-AG-1 (DR-5)', 'info', 'metodologica', 'Verifica que el agente sea humano o un grupo humano'),
    fila('ajuste-automatico', 'R-OPD-OP-5, R-OPD-EDIT-6', 'info', 'sugerencia', 'Revisa la colección y el contorno derivados en esta vista'),
    fila('cosa-sin-aparicion', 'T-262, A8.2', 'warning', 'identidad', 'Buscar › Traer esta cosa a un OPD'),
    fila('enlace-sin-vista', 'A8.2', 'warning', 'identidad', 'Trae a un OPD el extremo faltante del enlace'),
] as const);
export type CodigoDiagnostico = (typeof CATALOGO)[number]['codigo'];
const porCodigo = new Map<CodigoDiagnostico, FilaCatalogo>(CATALOGO.map(f => [f.codigo, f]));
const memo = new WeakMap<Modelo, readonly Diagnostico[]>();
const ref = (tipo: Ref['tipo'], id: Id): Ref => ({ tipo, id });
const infinitivo = (s: string) => /(?:ar|er|ir)$/iu.test(s);
const nominalizacion = (s: string) => /(?:ción|sión|miento|aje|ado|ido)$/iu.test(s);
const palabras = (s: string) => s.trim().split(/\s+/u).filter(Boolean);
const transformador = (e: Enlace) => e.tipo === 'consumo' || e.tipo === 'resultado' || e.tipo === 'efecto';
/** Barrido del modelo: las vistas, la herencia y la matriz conservan sus fuentes únicas. */
export function diagnosticar(m: Modelo): readonly Diagnostico[] {
    const previo = memo.get(m);
    if (previo)
        return previo;
    const idx = indice(m), ds: Diagnostico[] = [], claves = new Set<string>();
    const cosas = Object.values(m.cosas), enlaces = Object.values(m.enlaces);
    const añadir = (codigo: CodigoDiagnostico, refs: readonly Ref[], mensaje: string, extra: Partial<Omit<Diagnostico, 'codigo' | 'refs' | 'mensaje'>> = {}) => {
        const f = porCodigo.get(codigo)!;
        const d: Diagnostico = { codigo, regla: f.regla, severidad: f.severidad, familia: f.familia, accion: f.accion, refs, mensaje, ...extra };
        const clave = JSON.stringify([d.codigo, d.regla, d.opd, [...refs].map(r => [r.tipo, r.id]).sort()]);
        if (!claves.has(clave)) {
            claves.add(clave);
            ds.push(d);
        }
    };
    for (const e of enlaces)
        for (const v of violacionesContexto(m, e)) {
            // AP-27 posee dos filas: su severidad viene de la fila que realmente viola.
            const regla = REGLAS_CONTEXTO.find(r => r.id === v.regla && r.tipos.includes(e.tipo) && r.viola(m, e, idx));
            const reparacion = regla?.reparacion?.(e);
            añadir('enlace-invalido', v.refs, v.mensaje, { regla: v.regla, accion: regla?.accion ?? v.accion!, severidad: regla?.severidad ?? 'error',
                familia: ['R-DIST-1', 'R-CX-DIST-2', 'AP-07'].includes(v.regla) ? 'contencion' : 'gramatical', ...(reparacion ? { reparacion } : {}) });
        }
    for (const f of Object.values(m.abanicos)) {
        for (const v of violacionesAbanico(m, f))
            añadir('abanico-invalido', v.refs, v.mensaje, { regla: v.regla });
        for (const id of f.enlaces) {
            const e = m.enlaces[id];
            if (!e)
                continue;
            const no = noOfrecido(m, e, f);
            if (no)
                añadir('abanico-invalido', [ref('abanico', f.id)], no.motivo, { regla: no.regla });
        }
    }
    const enVista = new Set<Id>();
    for (const id of idx.preorden) {
        const o = m.opds[id]!, vista = proyectar(m, id);
        for (const e of vista.enlaces)
            for (const hecho of e.hechos)
                enVista.add(hecho);
        for (const d of vista.conflictos)
            añadir(d.codigo, d.refs, d.mensaje, { ...d });
        const n = vista.cosas.length;
        if (n > 25)
            añadir('opd-sobrecargado', [ref('opd', id)], `Este OPD contiene ${n} cosas.`, { opd: id });
        else if (n > 20)
            añadir('opd-denso', [ref('opd', id)], `Este OPD contiene ${n} cosas.`, { opd: id });
        if (o.tipo !== 'raiz') {
            const hijos = o.tipo === 'descomposicion' ? new Set(o.bandas.flat()).size : new Set(enlaces.filter(e => e.tipo === o.modo && 'refinable' in e && e.refinable === o.cosa).map(e => 'refinador' in e ? e.refinador : '')).size;
            if (hijos < 2)
                añadir('refinamiento-trivial', [ref('opd', id), ref('cosa', o.cosa)], `El refinamiento tiene ${hijos} hijos.`, { opd: id });
        }
        for (const c of vista.cosas) {
            const parcial = vista.incompletas.some(x => x.refinable === c.cosa && !x.declarada);
            const contorno = idx.refinamientosDe.get(c.cosa)?.descomposicion !== undefined && c.rol !== 'contenedor';
            if (parcial || contorno)
                añadir('ajuste-automatico', [ref('cosa', c.cosa), ref('opd', id)], parcial ? 'La vista muestra una colección parcial de refinadores.' : 'El contorno expresa una descomposición en otro nivel.', { opd: id });
        }
    }
    for (const ids of idx.porClaveNombre.values())
        for (const id of ids.slice(1)) {
            const c = m.cosas[id]!;
            añadir('nombre-duplicado', [ref('cosa', id)], `El nombre «${c.nombre}» ya identifica otra cosa.`, { reparacion: { op: 'renombrarCosa', args: { cosa: id, nombre: sugerirNombre(m, c.nombre, 'cosa', id) } } });
        }
    const propios = new Map<Id, boolean>();
    const tienePropio = (id: Id): boolean => {
        if (!propios.has(id))
            propios.set(id, [id, ...generales(m, id)].some(p => (idx.enlacesDeCosa.get(p) ?? []).some(e => { const x = m.enlaces[e]!; return transformador(x) && esProcedimental(x) && x.proceso === p; })));
        return propios.get(id)!;
    };
    const transforma = (id: Id): boolean => {
        const pendientes = [id], vistos = new Set<Id>();
        while (pendientes.length) {
            const p = pendientes.pop()!;
            if (vistos.has(p))
                continue;
            vistos.add(p);
            if (tienePropio(p))
                return true;
            const h = idx.refinamientosDe.get(p)?.descomposicion, o = h ? m.opds[h] : undefined;
            if (o?.tipo === 'descomposicion')
                pendientes.push(...o.bandas.flat());
        }
        return false;
    };
    let hayInfinitivo = false, hayNominalizacion = false;
    for (const c of cosas) {
        if (validarNombreCosa(c.nombre))
            añadir('nombre-fuera-de-lexico', [ref('cosa', c.id)], `«${c.nombre}» no cumple el léxico de cosa.`, { reparacion: { op: 'renombrarCosa', args: { cosa: c.id, nombre: sugerirNombre(m, c.nombre, 'cosa', c.id) } } });
        if (!(idx.aparicionesDe.get(c.id)?.length))
            añadir('cosa-sin-aparicion', [ref('cosa', c.id)], `«${c.nombre}» no aparece en ningún OPD.`);
        if (c.tipo === 'proceso') {
            if (!transforma(c.id))
                añadir('proceso-sin-transformacion', [ref('cosa', c.id)], `«${c.nombre}» no consume, crea ni afecta un objeto, directa o indirectamente.`);
            if (idx.subprocesoDe.has(c.id) && !tienePropio(c.id))
                añadir('subproceso-sin-transformado', [ref('cosa', c.id)], `El subproceso «${c.nombre}» no tiene un transformador propio o heredado.`);
            const ps = palabras(c.nombre), primera = ps[0] ?? '';
            if (ps.length < 2 || ps.length > 4)
                añadir('nombre-proceso-largo', [ref('cosa', c.id)], `«${c.nombre}» tiene ${ps.length} palabras; se recomiendan de dos a cuatro.`);
            if (!infinitivo(primera) && !nominalizacion(primera))
                añadir('nombre-proceso-no-deverbal', [ref('cosa', c.id)], `Revisa si «${c.nombre}» expresa una acción o su resultado (heurística).`);
            hayInfinitivo ||= infinitivo(primera);
            hayNominalizacion ||= nominalizacion(primera);
            const habilitadores = enlaces.filter(e => (e.tipo === 'agente' || e.tipo === 'instrumento') && e.proceso === c.id);
            if (c.afiliacion === 'sistemica' && habilitadores.length && habilitadores.every(e => esProcedimental(e) && m.cosas[e.objeto]?.afiliacion === 'ambiental'))
                añadir('proceso-de-ambientales', [ref('cosa', c.id)], `Todos los habilitadores de «${c.nombre}» son ambientales.`);
        }
        else {
            const ps = palabras(c.nombre);
            if (!ps.some(p => /^(Conjunto|Grupo)$/iu.test(p)) && /(?:s|es)$/iu.test(ps[0] ?? ''))
                añadir('nombre-objeto-plural', [ref('cosa', c.id)], `Revisa el plural de «${c.nombre}» (heurística).`);
            const nombres = new Set<string>();
            const incidentes = (idx.enlacesDeCosa.get(c.id) ?? []).map(id => m.enlaces[id]!);
            if (incidentes.length === 2 && incidentes.filter(e => e.tipo === 'consumo').length === 1 && incidentes.filter(e => e.tipo === 'resultado').length === 1)
                añadir('objeto-transiente', [ref('cosa', c.id)], `«${c.nombre}» se crea y consume sin otra observación.`);
            const flujo = incidentes.some(e => transformador(e));
            const escritorGenerico = incidentes.some(e => e.tipo === 'resultado' && e.estado === undefined || e.tipo === 'efecto' && e.entrada === undefined && e.salida === undefined || e.tipo === 'efecto' && e.salida === undefined);
            const caracterizacion = /^Coproducto XOR-n(?:\s|$)/u.test(c.descripcion ?? '');
            for (const s of c.estados) {
                const k = claveNombre(s.nombre);
                if (nombres.has(k))
                    añadir('estado-duplicado', [ref('estado', s.id)], `«${s.nombre}» se repite en «${c.nombre}».`, { reparacion: { op: 'renombrarEstado', args: { estado: s.id, nombre: sugerirNombre(m, s.nombre, 'estado', s.id) } } });
                nombres.add(k);
                if (validarNombreEstado(s.nombre))
                    añadir('estado-fuera-de-lexico', [ref('estado', s.id)], `«${s.nombre}» no cumple el léxico de estado.`, { reparacion: { op: 'renombrarEstado', args: { estado: s.id, nombre: sugerirNombre(m, s.nombre, 'estado', s.id) } } });
                if (infinitivo(s.nombre) || /^\d+$/u.test(s.nombre))
                    añadir('nombre-estado-no-descriptivo', [ref('estado', s.id)], `Revisa si «${s.nombre}» describe el estado (heurística).`);
                const escrito = incidentes.some(e => e.tipo === 'resultado' && e.estado === s.id || e.tipo === 'efecto' && e.salida === s.id);
                if (flujo && !s.inicial && c.afiliacion !== 'ambiental' && !caracterizacion && !escritorGenerico && !escrito)
                    añadir('estado-sin-escritor', [ref('estado', s.id), ref('cosa', c.id)], `El estado «${s.nombre}» de «${c.nombre}» no tiene escritor.`);
            }
        }
        // Redundancia: un general directo ya es alcanzable a través de otro general directo.
        const directos = enlaces.filter(e => e.tipo === 'generalizacion' && e.refinador === c.id);
        for (const e of directos)
            if (e.tipo === 'generalizacion' && directos.some(x => x.id !== e.id && x.tipo === 'generalizacion' && generales(m, x.refinable).includes(e.refinable)))
                añadir('general-redundante', [ref('enlace', e.id)], 'El general directo ya se alcanza mediante otro general.', { reparacion: { op: 'eliminarEnlaces', args: { enlaces: [e.id] } } });
    }
    if (hayInfinitivo && hayNominalizacion)
        añadir('mezcla-infinitivo-nominalizacion', cosas.filter(c => c.tipo === 'proceso').map(c => ref('cosa', c.id)), 'El modelo mezcla infinitivos y nominalizaciones de procesos.');
    const sd = m.opds[m.raiz]!;
    if (Object.keys(sd.apariciones).filter(id => { const c = m.cosas[id]; return c?.tipo === 'proceso' && c.afiliacion === 'sistemica'; }).length !== 1)
        añadir('sd-sin-proceso-unico', [ref('opd', m.raiz)], 'El SD no contiene exactamente un proceso sistémico.', { opd: m.raiz });
    const humanos = new Set<Id>();
    for (const e of enlaces) {
        if (!enVista.has(e.id))
            añadir('enlace-sin-vista', [ref('enlace', e.id)], 'El enlace no tiene vista en ningún OPD.');
        for (const texto of etiquetas(e)) {
            if (validarEtiqueta(texto))
                añadir('etiqueta-fuera-de-lexico', [ref('enlace', e.id)], `«${texto}» no cumple el léxico de etiqueta.`);
        }
        // cadena_etiqueta = nombre: la inicial puede ser mayúscula o minúscula.
        if ('ruta' in e && e.ruta !== undefined && validarNombreCosa(e.ruta) && validarEtiqueta(e.ruta))
            añadir('etiqueta-fuera-de-lexico', [ref('enlace', e.id)], `«${e.ruta}» no cumple el léxico de ruta.`);
        for (const texto of etiquetas(e))
            if (palabras(texto).length > 4)
                añadir('etiqueta-larga', [ref('enlace', e.id)], 'La etiqueta estructural supera cuatro palabras (heurística).');
        if (e.tipo === 'agente' && m.cosas[e.objeto]?.esencia === 'fisica')
            humanos.add(e.objeto);
        if (e.tipo === 'consumo' || e.tipo === 'resultado') {
            const h = idx.refinamientosDe.get(e.proceso)?.descomposicion, o = h ? m.opds[h] : undefined;
            if (o?.tipo === 'descomposicion' && !o.bandas.flat().length)
                añadir('enlace-en-contorno-temporal', [ref('enlace', e.id)], 'El enlace permanece temporalmente en un contorno sin subprocesos.');
        }
        if (e.tipo === 'excepcionSobretiempo' || e.tipo === 'excepcionSubtiempo') {
            if (m.cosas[e.destino]?.afiliacion !== 'ambiental')
                añadir('manejador-no-ambiental', [ref('cosa', e.destino), ref('enlace', e.id)], 'El manejador de excepción no es ambiental.', { reparacion: { op: 'fijarAfiliacion', args: { cosa: e.destino, afiliacion: 'ambiental' } } });
            const p = m.cosas[e.origen], cota = e.tipo === 'excepcionSobretiempo' ? 'max' : 'min';
            if (p?.tipo === 'proceso' && p.duracion?.[cota] === undefined)
                añadir('cota-faltante', [ref('cosa', e.origen), ref('enlace', e.id)], `El proceso fuente no declara la cota ${cota}.`);
        }
    }
    for (const id of humanos)
        añadir('agente-humano', [ref('cosa', id)], 'Verifica que el agente físico sea humano o un grupo humano.');
    const ambientales = cosas.filter(c => c.afiliacion === 'ambiental').map(c => c.id), visitados = new Set<Id>();
    while (ambientales.length) {
        const id = ambientales.pop()!;
        if (visitados.has(id))
            continue;
        visitados.add(id);
        for (const e of enlaces)
            if (e.tipo === 'exhibicion' && e.refinable === id) {
                const c = m.cosas[e.refinador];
                if (!c)
                    continue;
                if (c.afiliacion !== 'ambiental')
                    añadir('afiliacion-incoherente', [ref('cosa', c.id)], `El rasgo «${c.nombre}» de un exhibidor ambiental es sistémico.`, { reparacion: { op: 'fijarAfiliacion', args: { cosa: c.id, afiliacion: 'ambiental' } } });
                ambientales.push(c.id);
            }
    }
    const contextos = new Map<Id, Set<string>>();
    for (const o of Object.values(m.opds))
        if (o.tipo === 'despliegue')
            for (const e of enlaces)
                if (e.tipo === o.modo && 'refinable' in e && e.refinable === o.cosa) {
                    const modos = contextos.get(e.refinador) ?? new Set<string>();
                    modos.add(o.modo);
                    contextos.set(e.refinador, modos);
                }
    for (const [id, modos] of contextos)
        if (modos.size > 1)
            añadir('refinador-en-varios-contextos', [ref('cosa', id)], 'El refinador pertenece a contextos con relaciones distintas.');
    const resultado = Object.freeze(ds.map(d => Object.freeze(d)));
    memo.set(m, resultado);
    return resultado;
}
function etiquetas(e: Enlace): readonly string[] { return e.tipo === 'etiquetadoBidireccional' ? [e.etiqueta, e.inversa] : 'etiqueta' in e && e.etiqueta !== undefined ? [e.etiqueta] : []; }
/** Solo los motivos específicos de export bloquean; ninguna operación de edición se ejecuta. */
export function gatesExportacion(m: Modelo, alcance: {
    readonly opd: Id;
} | 'modelo'): readonly Rechazo[] {
    const ds = diagnosticar(m);
    if (alcance === 'modelo')
        return ds.filter(d => d.severidad === 'error' || ['opd-sobrecargado', 'refinamiento-trivial', 'cosa-sin-aparicion', 'enlace-sin-vista'].includes(d.codigo)).map(aRechazo);
    const vista = proyectar(m, alcance.opd);
    const cosas = new Set(vista.cosas.map(c => c.cosa)), estados = new Set(vista.cosas.flatMap(c => c.estadosVisibles)), hechos = new Set(vista.enlaces.flatMap(e => e.hechos)), abanicos = new Set(vista.abanicos.map(f => f.abanico));
    // Un abanico inválido puede carecer de glifo de fan y conservar ramas visibles.
    for (const f of Object.values(m.abanicos))
        if (f.enlaces.some(id => hechos.has(id)))
            abanicos.add(f.id);
    const visible = (r: Ref) => r.tipo === 'cosa' ? cosas.has(r.id) : r.tipo === 'estado' ? estados.has(r.id) : r.tipo === 'enlace' ? hechos.has(r.id) : r.tipo === 'abanico' ? abanicos.has(r.id) : r.id === alcance.opd;
    return ds.filter(d => d.opd !== undefined && d.opd !== alcance.opd ? false : ['opd-sobrecargado', 'refinamiento-trivial'].includes(d.codigo) ? d.opd === alcance.opd : d.severidad === 'error' && d.refs.some(visible)).map(aRechazo);
}
function aRechazo(d: Diagnostico): Rechazo { return { codigo: 'contexto', regla: d.regla, mensaje: d.mensaje, accion: d.accion, refs: d.refs }; }
