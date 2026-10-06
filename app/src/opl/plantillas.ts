import type { Cosa, Enlace, Modelo, Multiplicidad, Operador, Ref, UnidadTiempo } from '../nucleo/tipos';
import { esProcedimental } from '../nucleo/tipos';
import { indice } from '../nucleo/indice';
import { conjuncionO, conjuncionY } from '../nucleo/lexico';
import type { EnlaceTexto, ExtremoTexto, HechoTexto, NombreTipado } from './analizar';
import type { TokenOpl } from './linea';
/** Un hueco conserva su identidad y su papel, además de su superficie. No contiene Markdown. */
export interface Hueco {
    readonly texto: string;
    readonly tokens?: readonly TokenOpl[];
    readonly bandas?: readonly (readonly Hueco[])[];
    readonly marca?: 'objeto' | 'proceso' | 'estado';
    readonly ref?: Ref;
    readonly hecho?: string;
    readonly genero?: 'f';
    readonly mult?: Multiplicidad;
    readonly estado?: Hueco;
}
export type ValorHueco = Hueco | readonly Hueco[];
export interface Huecos {
    readonly [nombre: string]: ValorHueco | undefined;
}
export interface HechoGenerable {
    readonly plantilla: string;
    readonly huecos: Huecos;
}
export interface Plantilla {
    readonly id: string;
    readonly patron: string;
    readonly estado: 'G' | 'P';
    readonly familia: 'cosa' | 'transformadora' | 'habilitadora' | 'evento' | 'condicion' | 'excepcion' | 'invocacion' | 'estructural' | 'etiquetada' | 'abanico' | 'contexto';
    readonly desde?: (h: HechoGenerable) => Huecos | null;
    readonly hacia: (h: Huecos) => readonly HechoTexto[];
    readonly restricciones?: (h: Huecos) => boolean;
}
// Expansiones finitas de la tabla: se comparten entre emisión y vocabulario.
const cuantificadores = { XOR: 'exactamente uno de', OR: 'al menos uno de' } as const;
const multiplicidades = { '?': ['un opcional ', 'una opcional '], '*': ['opcional (cero o más) ', 'opcional (cero o más) '], '+': ['al menos un ', 'al menos una '] } as const;
const filas: readonly [
    string,
    string,
    Plantilla['familia'],
    'P'?
][] = [
    ['D1', '{C} es físico|física.', 'cosa'], ['D2', '{C} es informacional.', 'cosa'], ['D3', '{C} es ambiental.', 'cosa'], ['D4', '{C} es sistémico|sistémica.', 'cosa', 'P'],
    ['ENT3', '{C} es un objeto|proceso {esencia}[ y {afiliacion}].', 'cosa', 'P'], ['D11', '{C} es persistente.', 'cosa', 'P'], ['D12', '{C} es transitoria.', 'cosa', 'P'],
    ['D5', '{O} puede estar {Lo:s}.', 'cosa'], ['D6', '{O} puede estar {Lista:s}, y otros estados.', 'cosa'],
    ['D7', 'Estado {s} de {O} es inicial.', 'cosa'], ['D8', 'Estado {s} de {O} es final.', 'cosa'], ['D10', 'Estado {s} de {O} es inicial y final.', 'cosa'], ['D9', 'Estado {s} de {O} es por defecto.', 'cosa'], ['D13', 'Estado {s} de {O} es declarado `Current`.', 'cosa'],
    ['VAL', '{O1} de {O2} es {v}.', 'cosa'], ['ATR-E', '{O1} de {O2} puede estar {Lo:s}.', 'cosa', 'P'],
    ['T1', '{P} consume {mO}.', 'transformadora'], ['TS1', '{P} consume {mO} en {s}.', 'transformadora'], ['T2', '{P} genera {mO}.', 'transformadora'], ['TS2', '{P} genera {mO} en {s}.', 'transformadora'], ['T3', '{P} afecta {mO}.', 'transformadora'], ['TS3', '{P} cambia {O} de {e} a {s}.', 'transformadora'], ['TS4', '{P} cambia {O} de {e}.', 'transformadora'], ['TS5', '{P} cambia {O} a {s}.', 'transformadora'],
    ['H1', '{mO} maneja {P}.', 'habilitadora'], ['HS1', '{mO} en {s} maneja {P}.', 'habilitadora'], ['H2', '{P} requiere {mO}.', 'habilitadora'], ['HS2', '{P} requiere {mO} en {s}.', 'habilitadora'],
    ['ET1', '{mO} inicia {P}, que consume {O}.', 'evento'], ['ETS1', '{mO} en {s} inicia {P}, que consume {O}.', 'evento'], ['ET2', '{mO} inicia {P}, que afecta {O}.', 'evento'], ['ETS2', '{O} en {e} inicia {P}, que cambia {O} de {e} a {s}.', 'evento'], ['ETS3', '{O} en {e} inicia {P}, que cambia {O} de {e}.', 'evento'], ['ETS4', '{O} en cualquier estado inicia {P}, que cambia {O} a {s}.', 'evento'], ['EH1', '{mO} inicia y maneja {P}.', 'evento'], ['EHS1', '{mO} en {s} inicia y maneja {P}.', 'evento'], ['EH2', '{mO} inicia {P}, que requiere {O}.', 'evento'], ['EHS2', '{mO} en {s} inicia {P}, que requiere {O} en {s}.', 'evento'],
    ['CT1', '{P} ocurre si {O} existe, en cuyo caso {O} se consume, de lo contrario {P} se omite.', 'condicion'], ['CS1', '{P} ocurre si {O} está en {s}, en cuyo caso {O} se consume, de lo contrario {P} se omite.', 'condicion'], ['CT2', '{P} ocurre si {O} existe, en cuyo caso {P} afecta {O}, de lo contrario {P} se omite.', 'condicion'], ['CS2', '{P} ocurre si {O} está en {e}, en cuyo caso {P} cambia {O} de {e} a {s}, de lo contrario {P} se omite.', 'condicion'], ['CS3', '{P} ocurre si {O} está en {e}, en cuyo caso {P} cambia {O} de {e}, de lo contrario {P} se omite.', 'condicion'], ['CS4', '{P} ocurre si {O} existe, en cuyo caso {P} cambia {O} a {s}, de lo contrario {P} se omite.', 'condicion'], ['CH1', '{O} maneja {P} si {O} existe, de lo contrario {P} se omite.', 'condicion'], ['CS5', '{O} maneja {P} si {O} está en {s}, de lo contrario {P} se omite.', 'condicion'], ['CH2', '{P} ocurre si {O} existe, de lo contrario {P} se omite.', 'condicion'], ['CS6', '{P} ocurre si {O} está en {s}, de lo contrario {P} se omite.', 'condicion'], ['COND-ALT', 'Si {O} existe entonces {P} ocurre y consume {O}, de lo contrario se omite {P}.', 'condicion', 'P'],
    ['EX1', '{P1} ocurre si duración de {P2} excede {n} {u}.', 'excepcion'], ['EX2', '{P1} ocurre si duración de {P2} es menor que {n} {u}.', 'excepcion'], ['EX1r', '{P1} ocurre si duración de {P2} excede su duración máxima.', 'excepcion'], ['EX2r', '{P1} ocurre si duración de {P2} es menor que su duración mínima.', 'excepcion'], ['IV1', '{P1} invoca {P2}.', 'invocacion'], ['IV2', '{P} se invoca a sí mismo.', 'invocacion'],
    ['RF1', '{vertice} consta de {Ly:mC}.', 'estructural'], ['RF1i', '{vertice} consta de {Lista:mC} y al menos otra parte.', 'estructural'], ['RF2', '{vertice} exhibe {Ly:C}.', 'estructural'], ['RF2b', '{vertice} exhibe {Ly:C} así como {Ly:otro}.', 'estructural'], ['RF2i', '{vertice} exhibe {Lista:C}[ así como {Ly:otro}] y al menos otro rasgo.', 'estructural'], ['RF3', '{Ly:C} son {general}.', 'estructural'], ['RF3b', '{C} es un|una {general}.', 'estructural'], ['RF3i', '{Lista:C} y al menos otra especialización son {general}.', 'estructural'], ['RH1', '{C} es {Ly:articulos}.', 'estructural'], ['RFE', '{Ly:Oe} son {O} en {s}.', 'estructural'], ['RF4', '{C} es una instancia de {general}.', 'estructural'], ['RF4b', '{Ly:C} son instancias de {general}.', 'estructural'],
    ['SE1', '{mC1} {t} {mC2}.', 'etiquetada'], ['SE2', '{mC1} se relaciona con {mC2}.', 'etiquetada'], ['SSE1', '{O1} en {a} {t} {O2}.', 'etiquetada'], ['SSE2', '{O1} {t} {O2} en {b}.', 'etiquetada'], ['SSE3', '{O1} en {a} {t} {O2} en {b}.', 'etiquetada'], ['SE3', '{mC1} {t} {mC2}.', 'etiquetada'], ['SSE4', '{O1} en {a} {t} {O2}.', 'etiquetada'], ['SSE5', '{O2} {t2} {O1} en {a}.', 'etiquetada'], ['SE4', '{mC1} y {mC2} son {t}.', 'etiquetada'], ['SE5', '{mC1} y {mC2} se relacionan.', 'etiquetada'], ['SSE6', '{O1} en {a} y {O2} en {b} son {t}.', 'etiquetada'], ['SSE7', '{O2} y {O1} en {a} son {t}.', 'etiquetada'],
    ['FAN5s', '{P} cambia {O} a {Q} {Lo:s}.', 'abanico'], ['FAN5e', '{P} cambia {O} de {Q} {Lo:s}.', 'abanico'], ['FAN5A', '{P} cambia {O} de {e} a {Q} {Lo:s}.', 'abanico'], ['FAN4', '{O} inicia {Q} {Lo:Plista}, y es afectado por el proceso que ocurre.', 'abanico'], ['CFE', '{Q^} {Lo:Plista} ocurre si {O} existe, en cuyo caso afecta {O}, de lo contrario se omite.', 'abanico'], ['C18', '{P} ocurre si {Q} {Lo:Olista} existe, en cuyo caso {P} consume {Q} {Lo:Olista}, de lo contrario {P} se omite.', 'abanico'],
    ['CX1', '{P} se descompone en {Ly:Plista}, en esa secuencia[, así como {Ly:O}].', 'contexto'], ['CX2', '{P} se descompone en paralelo {Ly:Plista}[, así como {Ly:O}].', 'contexto'], ['CXM', '{P} se descompone en {SEC}, en esa secuencia[, así como {Ly:O}].', 'contexto'], ['CXI', '{P} se descompone en {Ly:Plista}, así como {Ly:O}.', 'contexto', 'P'], ['CXN', '{P} desde {padre} se descompone en {opd} en {SEC}, en esa secuencia.', 'contexto', 'P'], ['CX3', '{vertice} se despliega en {opd} en {Ly:C}[, así como {Ly:otro}].', 'contexto'], ['CX3s', '{vertice} se despliega en {Ly:C}.', 'contexto', 'P']
];
const fans: readonly [
    string,
    string,
    string
][] = [
    ['consumo', '{P} consume {Q} {Lo:mOlistae}.', '{Q^} {Lo:Plista} consume {mOe}.'],
    ['resultado', '{Q^} {Lo:Plista} genera {mOe}.', '{P} genera {Q} {Lo:mOlistae}.'],
    ['efecto', '{P} afecta {Q} {Lo:mOlista}.', '{O} es afectado por {Q} {Lo:Plista}.'],
    ['agente', '{P} es manejado por {Q} {Lo:mOlistae}.', '{O} maneja {Q} {Lo:Plista}.'],
    ['instrumento', '{P} requiere {Q} {Lo:mOlistae}.', '{Q^} {Lo:Plista} requiere {mOe}.'],
    ['invocacion', '{Q^} {Lo:Plista} invoca {P}.', '{P} invoca {Q} {Lo:Plista}.']
];
const conRuta = new Set(['T1', 'TS1', 'T2', 'TS2', 'ET1', 'ETS1', 'CT1', 'CS1']);
export const PLANTILLAS: readonly Plantilla[] = Object.freeze([
    ...filas,
    ...fans.flatMap(([tipo, c, d]) => ['XOR', 'OR'].flatMap(op => [[`FAN-${tipo}-convergente-${op}`, c, 'abanico'], [`FAN-${tipo}-divergente-${op}`, d, 'abanico']] as [
        string,
        string,
        'abanico'
    ][]))
].map(([id, base, familia, p]) => { const patron = conRuta.has(id) ? `[Por ruta {r}, ]${base}` : base; return Object.freeze({ id, patron, familia: familia as Plantilla['familia'], estado: p ?? 'G', ...(p ? {} : { desde: (h: HechoGenerable) => h.plantilla === id && validarHuecos(patron, h.huecos) ? h.huecos : null }), hacia: (h: Huecos) => validarHuecos(patron, h) ? reconocer(id, h) : [], restricciones: (h: Huecos) => validarHuecos(patron, h) }); }));
const tabla = new Map(PLANTILLAS.map(p => [p.id, p]));
export const hueco = (texto: string): Hueco => ({ texto });
export function cosa(m: Modelo, id: string, hecho?: string, mult?: Multiplicidad, estado?: string): Hueco {
    const c = m.cosas[id]!;
    return { texto: c.nombre, marca: c.tipo, ref: { tipo: 'cosa', id }, ...(c.genero ? { genero: c.genero } : {}), ...(hecho ? { hecho } : {}), ...(mult ? { mult } : {}), ...(estado ? { estado: estadoHueco(m, estado, hecho) } : {}) };
}
export function estadoHueco(m: Modelo, id: string, hecho?: string): Hueco {
    const dueño = indice(m).estadoDe.get(id), c = dueño ? m.cosas[dueño.objeto] : undefined;
    if (!dueño || c?.tipo !== 'objeto')
        throw new Error(`Estado sin dueño: ${id}`);
    return { texto: c.estados[dueño.posicion]!.nombre, marca: 'estado', ref: { tipo: 'estado', id }, ...(hecho ? { hecho } : {}) };
}
function uno(h: Huecos, k: string): Hueco { const x = h[k]; if (!x || Array.isArray(x))
    throw new Error(`Hueco escalar ausente: ${k}`); return x as Hueco; }
function lista(h: Huecos, k: string): readonly Hueco[] { const x = h[k]; return !x ? [] : Array.isArray(x) ? x : [x as Hueco]; }
function validarHuecos(patron: string, h: Huecos): boolean {
    if (h.n && (!/^\d+(?:\.\d+)?$/.test(uno(h, 'n').texto) || !Number.isFinite(Number(uno(h, 'n').texto)))) return false;
    if (h.u && !Object.values(unidades).some(palabras => palabras.includes(uno(h, 'u').texto))) return false;
    const obligatorio = patron.replace(/\[([^\[\]]+)\]/g, '');
    for (const match of obligatorio.matchAll(/\{([^}]+)\}/g)) {
        const k = match[1]!;
        if (k === 'Q' || k === 'Q^') {
            if (!h.operador || !['XOR', 'OR'].includes(uno(h, 'operador').texto))
                return false;
            continue;
        }
        const name = k.replace(/^(Ly|Lo|Lista):/, ''), base = name.startsWith('m') ? name.slice(1) : name;
        const valores = lista(h, name).length ? lista(h, name) : lista(h, base).length ? lista(h, base) : base.endsWith('e') && base !== 'e' ? lista(h, base.slice(0, -1)) : [];
        if (!valores.length)
            return false;
        if (valores.some(v => typeof v.texto !== 'string'))
            return false;
    }
    return true;
}
export function tokensPlantilla(id: string, h: Huecos): readonly TokenOpl[] {
    const p = tabla.get(id);
    if (!p)
        throw new Error(`Plantilla desconocida: ${id}`);
    let patron = p.patron;
    patron = patron.replace(/físico\|física/g, h.C && !Array.isArray(h.C) && uno(h, 'C').genero === 'f' ? 'física' : 'físico').replace(/sistémico\|sistémica/g, h.C && !Array.isArray(h.C) && uno(h, 'C').genero === 'f' ? 'sistémica' : 'sistémico');
    patron = patron.replace(/un\|una/g, (h.general && uno(h, 'general').genero === 'f') ? 'una' : 'un');
    patron = patron.replace(/\[([^\[\]]+)\]/g, (_, s: string) => { const keys = [...s.matchAll(/\{(?:L[oy]:)?([^}]+)\}/g)].map(x => x[1]!); return keys.every(k => lista(h, k).length) ? s : ''; });
    const tokens: TokenOpl[] = [];
    const literal = (texto: string, rol: TokenOpl['rol'] = 'verbo') => { if (!texto)
        return; const parts = texto.split('`Current`'); parts.forEach((part, i) => { if (i)
        tokens.push({ texto: 'Current', rol: 'estado', marca: 'estado' }); if (part)
        tokens.push({ texto: part, rol }); }); };
    function atom(x: Hueco, mult = false, conEstado = false, articulo = false) {
        if (articulo)
            literal(x.genero === 'f' ? 'una ' : 'un ');
        if (mult && x.mult)
            literal(multiplicidades[x.mult][x.genero === 'f' ? 1 : 0], 'multiplicidad');
        if (x.tokens) {
            tokens.push(...x.tokens);
            return;
        }
        tokens.push({ texto: x.texto, rol: x.marca === 'estado' ? 'estado' : x.marca ? 'nombre' : 'texto', ...(x.marca ? { marca: x.marca } : {}), ...(x.ref ? { ref: x.ref } : {}), ...(x.hecho ? { hecho: x.hecho } : {}) });
        if (conEstado && x.estado) {
            literal(' en ');
            atom(x.estado);
        }
    }
    function superficieInicial(k: string, x: Hueco): string {
        const name = k.replace(/^(Ly|Lo|Lista):/, '');
        if (name === 'articulos') return x.genero === 'f' ? 'una ' : 'un ';
        if (name.startsWith('m') && x.mult) return multiplicidades[x.mult][x.genero === 'f' ? 1 : 0];
        return x.tokens?.map(t => t.texto).join('') || x.texto;
    }
    function slot(k: string) {
        if (k === 'Q' || k === 'Q^') {
            literal(cuantificadores[uno(h, 'operador').texto as Operador]);
            return;
        }
        const match = /^(Ly|Lo|Lista):(.+)$/.exec(k);
        const name = match ? match[2]! : k, mult = name.startsWith('m'), est = name.endsWith('e') && name !== 'e';
        const base = mult ? name.slice(1) : name;
        const values = lista(h, name).length ? lista(h, name) : lista(h, base).length ? lista(h, base) : est ? lista(h, base.slice(0, -1)) : [];
        if (!values.length)
            throw new Error(`Hueco ausente ${id}: ${k}`);
        values.forEach((x, i) => { if (i) {
            const ultimo = i === values.length - 1;
            const superficie = superficieInicial(k, x);
            literal(!match || match[1] === 'Lista' || !ultimo ? ', ' : ` ${match[1] === 'Lo' ? conjuncionO(superficie) : conjuncionY(superficie)} `);
        } atom(x, mult, est, name === 'articulos'); });
    }
    let pos = 0;
    for (const x of patron.matchAll(/\{([^}]+)\}/g)) {
        let tramo = patron.slice(pos, x.index);
        const name = x[1]!.replace(/^(Ly|Lo|Lista):/, '');
        const base = name.startsWith('m') ? name.slice(1) : name;
        const siguiente = lista(h, name)[0] ?? lista(h, base)[0];
        if (siguiente && / y $/.test(tramo))
            tramo = tramo.replace(/ y $/, ` ${conjuncionY(superficieInicial(x[1]!, siguiente))} `);
        literal(tramo);
        slot(x[1]!);
        pos = x.index! + x[0].length;
    }
    literal(patron.slice(pos));
    // Capitalización inicial sin modificar nombres tipados ni identidades.
    const first = tokens[0];
    if (first && !first.marca)
        tokens[0] = { ...first, texto: first.texto.charAt(0).toLocaleUpperCase('es') + first.texto.slice(1) };
    return tokens;
}
export function datosEnlace(m: Modelo, e: Enlace, inverso = false): HechoGenerable {
    const h: Record<string, ValorHueco> = {};
    const c = (id: string, mult?: Multiplicidad) => cosa(m, id, e.id, mult);
    const s = (id: string) => estadoHueco(m, id, e.id);
    let id: string;
    if (esProcedimental(e)) {
        h.P = c(e.proceso);
        h.O = c(e.objeto, e.mult);
        h.mO = h.O;
        if ((e.tipo === 'consumo' || e.tipo === 'resultado') && e.ruta)
            h.r = { texto: e.ruta, hecho: e.id, ref: { tipo: 'enlace', id: e.id } };
        if (e.tipo === 'efecto') {
            if (e.entrada)
                h.e = s(e.entrada);
            if (e.salida)
                h.s = s(e.salida);
            id = e.entrada ? (e.salida ? 'TS3' : 'TS4') : (e.salida ? 'TS5' : 'T3');
            if (e.control === 'e')
                id = e.entrada ? (e.salida ? 'ETS2' : 'ETS3') : (e.salida ? 'ETS4' : 'ET2');
            if (e.control === 'c')
                id = e.entrada ? (e.salida ? 'CS2' : 'CS3') : (e.salida ? 'CS4' : 'CT2');
        }
        else {
            if (e.estado)
                h.s = s(e.estado);
            const base = { consumo: ['T1', 'TS1', 'ET1', 'ETS1', 'CT1', 'CS1'], resultado: ['T2', 'TS2', 'T2', 'TS2', 'T2', 'TS2'], agente: ['H1', 'HS1', 'EH1', 'EHS1', 'CH1', 'CS5'], instrumento: ['H2', 'HS2', 'EH2', 'EHS2', 'CH2', 'CS6'] }[e.tipo];
            id = base[('control' in e && e.control === 'e' ? 2 : 'control' in e && e.control === 'c' ? 4 : 0) + (e.estado ? 1 : 0)]!;
        }
    }
    else if (e.tipo === 'invocacion') {
        id = e.origen === e.destino ? 'IV2' : 'IV1';
        h.P = c(e.origen);
        h.P1 = c(e.origen);
        h.P2 = c(e.destino);
    }
    else if (e.tipo === 'excepcionSobretiempo' || e.tipo === 'excepcionSubtiempo') {
        h.P1 = c(e.destino);
        h.P2 = c(e.origen);
        // Una fuente elevada conserva el ID del hecho: su cota sigue siendo nuclear.
        // P2 expresa el extremo visible de esta vista, sin sustituirlo por algo invisible.
        const original = m.enlaces[e.id];
        const fuente = m.cosas[original?.tipo === e.tipo ? original.origen : e.origen];
        const campo = e.tipo === 'excepcionSobretiempo' ? 'max' : 'min';
        const dur = fuente?.tipo === 'proceso' ? fuente.duracion : undefined;
        const n = dur?.[campo];
        id = e.tipo === 'excepcionSobretiempo' ? 'EX1' : 'EX2';
        if (n === undefined)
            id += 'r';
        else {
            h.n = hueco(String(n));
            h.u = hueco(unidad(dur?.unidad ?? m.unidadTiempo, n));
            h.unidad = hueco(dur?.unidad ?? m.unidadTiempo);
        }
    }
    else if ('refinable' in e) {
        h.vertice = c(e.refinable);
        h.C = c(e.tipo === 'generalizacion' || e.tipo === 'clasificacion' ? e.refinador : e.refinable, e.tipo === 'agregacion' ? e.mult : undefined);
        h.general = c(e.refinable);
        id = { agregacion: 'RF1', exhibicion: 'RF2', generalizacion: 'RF3b', clasificacion: 'RF4' }[e.tipo];
        if (e.tipo === 'agregacion' || e.tipo === 'exhibicion')
            h.C = [c(e.refinador, e.tipo === 'agregacion' ? e.mult : undefined)];
        if (e.tipo === 'generalizacion' && e.estados) {
            id = 'RFE';
            h.O = c(e.refinable);
            h.s = s(e.estados.general);
            h.Oe = [{ ...c(e.refinador), estado: s(e.estados.especializacion) }];
        }
    }
    else if (e.tipo === 'etiquetado' || e.tipo === 'etiquetadoBidireccional' || e.tipo === 'reciproco') {
        h.C1 = c(e.origen, e.multOrigen);
        h.C2 = c(e.destino, e.multDestino);
        h.O1 = h.C1;
        h.O2 = h.C2;
        h.t = { texto: e.etiqueta ?? 'se relaciona con', hecho: e.id, ref: { tipo: 'enlace', id: e.id } };
        if (e.tipo === 'reciproco') {
            if (e.estados) {
                h.a = s(e.estados.origen);
                if (e.estados.destino)
                    h.b = s(e.estados.destino);
                id = e.estados.destino ? 'SSE6' : 'SSE7';
            }
            else
                id = e.etiqueta ? 'SE4' : 'SE5';
        }
        else if (e.tipo === 'etiquetadoBidireccional') {
            h.t2 = { texto: e.inversa, hecho: e.id, ref: { tipo: 'enlace', id: e.id } };
            if (e.estadoOrigen) {
                h.a = s(e.estadoOrigen);
                id = inverso ? 'SSE5' : 'SSE4';
            }
            else {
                id = 'SE3';
                if (inverso) {
                    [h.C1, h.C2] = [h.C2!, h.C1!];
                    h.t = h.t2;
                }
            }
        }
        else {
            if (e.estadoOrigen)
                h.a = s(e.estadoOrigen);
            if (e.estadoDestino)
                h.b = s(e.estadoDestino);
            id = e.estadoOrigen ? (e.estadoDestino ? 'SSE3' : 'SSE1') : (e.estadoDestino ? 'SSE2' : e.etiqueta ? 'SE1' : 'SE2');
        }
    }
    else
        throw new Error(`Tipo sin plantilla: ${e.tipo}`);
    return { plantilla: id, huecos: h };
}
const unidades: Record<UnidadTiempo, readonly [
    string,
    string
]> = { ms: ['milisegundo', 'milisegundos'], sec: ['segundo', 'segundos'], min: ['minuto', 'minutos'], hour: ['hora', 'horas'], day: ['día', 'días'], week: ['semana', 'semanas'], month: ['mes', 'meses'], year: ['año', 'años'] };
export const LITERALES_EXPANDIDOS: readonly string[] = Object.freeze([
    ...Object.values(cuantificadores), ...Object.values(multiplicidades).flat(),
    // Ly/Lo son macros fonéticos definidos por nucleo/lexico. Su universo es finito.
    'y', 'e', 'o', 'u', ...Object.values(unidades).flat()
]);
export function unidad(u: UnidadTiempo, n: number): string { return unidades[u][n === 1 ? 0 : 1]; }
function reconocer(id: string, h: Huecos): readonly HechoTexto[] {
    const x = (k: string) => uno(h, k), nombre = (k: string): NombreTipado => ({ nombre: x(k).texto, tipo: x(k).marca === 'proceso' ? 'proceso' : 'objeto' });
    const extremo = (v: Hueco): ExtremoTexto => ({ nombre: v.texto, tipo: v.marca === 'proceso' ? 'proceso' : 'objeto', ...(v.genero ? { genero: v.genero } : {}), ...(v.mult ? { mult: v.mult } : {}), ...(v.estado ? { estado: v.estado.texto } : {}) });
    const ext = (k: string) => extremo(x(k));
    if (id === 'D1' || id === 'D2')
        return [{ k: id === 'D1' ? 'esencia' : 'mencion', cosa: nombre('C'), ...(id === 'D1' ? { valor: 'fisica' as const } : {}) } as HechoTexto];
    if (id === 'D3' || id === 'D4')
        return [{ k: 'afiliacion', cosa: nombre('C'), valor: id === 'D3' ? 'ambiental' : 'sistemica' }];
    if (['D5', 'D6', 'ATR-E'].includes(id)) {
        const O = id === 'ATR-E' ? 'O1' : 'O';
        const hechos: HechoTexto[] = [{ k: 'estados', objeto: x(O).texto, nombres: lista(h, 's').map(s => s.texto), otros: id === 'D6' }];
        if (id === 'ATR-E')
            hechos.push({ k: 'enlace', enlace: { tipo: 'exhibicion', refinable: ext('O2'), refinador: ext('O1') } });
        return hechos;
    }
    if (['D7', 'D8', 'D9', 'D10', 'D13'].includes(id))
        return [{ k: 'designacion', objeto: x('O').texto, estado: x('s').texto, designaciones: id === 'D10' ? ['inicial', 'final'] : id === 'D7' ? ['inicial'] : id === 'D8' ? ['final'] : id === 'D9' ? ['porDefecto'] : ['current'] }];
    if (id === 'VAL')
        return [{ k: 'valor', atributo: x('O1').texto, exhibidor: x('O2').texto, valor: x('v').texto }];
    if (id === 'ENT3') {
        const hechos: HechoTexto[] = [{ k: 'mencion', cosa: nombre('C') }];
        if (h.esencia)
            hechos.push({ k: 'esencia', cosa: nombre('C'), valor: /^f[ií]sic/.test(x('esencia').texto) ? 'fisica' : 'informacional' });
        if (h.afiliacion)
            hechos.push({ k: 'afiliacion', cosa: nombre('C'), valor: x('afiliacion').texto === 'ambiental' ? 'ambiental' : 'sistemica' });
        return hechos;
    }
    if (['D11', 'D12'].includes(id))
        return [{ k: 'mencion', cosa: nombre('C') }];
    let tipo: EnlaceTexto['tipo'] | undefined;
    if (/^(T1|TS1|ET1|ETS1|CT1|CS1|COND-ALT)$/.test(id))
        tipo = 'consumo';
    if (/^(T2|TS2)$/.test(id))
        tipo = 'resultado';
    if (/^(T3|TS[345]|ET2|ETS[234]|CT2|CS[234])$/.test(id))
        tipo = 'efecto';
    if (/^(H1|HS1|EH1|EHS1|CH1|CS5)$/.test(id))
        tipo = 'agente';
    if (/^(H2|HS2|EH2|EHS2|CH2|CS6)$/.test(id))
        tipo = 'instrumento';
    if (tipo) {
        const objeto = ext('O'), proceso = x('P').texto, control = id.startsWith('E') ? 'e' : id.startsWith('C') ? 'c' : undefined;
        return [{ k: 'enlace', enlace: tipo === 'efecto' ? { tipo, objeto, proceso, ...(h.e ? { entrada: x('e').texto } : {}), ...(h.s ? { salida: x('s').texto } : {}), ...(control ? { control } : {}) } : { tipo: tipo as 'consumo' | 'resultado' | 'agente' | 'instrumento', objeto: { ...objeto, ...(h.s ? { estado: x('s').texto } : {}) }, proceso, ...(control ? { control } : {}), ...(h.r ? { ruta: x('r').texto } : {}) } }];
    }
    if (id === 'IV1' || id === 'IV2')
        return [{ k: 'enlace', enlace: { tipo: 'invocacion', origen: x(id === 'IV2' ? 'P' : 'P1').texto, destino: x(id === 'IV2' ? 'P' : 'P2').texto } }];
    if (id.startsWith('EX')) {
        const hechos: HechoTexto[] = [{ k: 'enlace', enlace: { tipo: id.startsWith('EX1') ? 'excepcionSobretiempo' : 'excepcionSubtiempo', origen: x('P2').texto, destino: x('P1').texto } }];
        if (h.n && (h.unidad || h.u))
            hechos.push({ k: 'cota', proceso: x('P2').texto, campo: id.startsWith('EX1') ? 'max' : 'min', n: Number(x('n').texto), unidad: (h.unidad ? x('unidad').texto : Object.entries(unidades).find(([, palabras]) => palabras.includes(x('u').texto))?.[0]) as UnidadTiempo });
        return hechos;
    }
    if (id.startsWith('FAN') || id === 'C18' || id === 'CFE') {
        const operador = x('operador').texto as Operador;
        const ramas: EnlaceTexto[] = [];
        if (id === 'FAN5s' || id === 'FAN5e' || id === 'FAN5A') {
            for (const estado of lista(h, 's'))
                ramas.push({ tipo: 'efecto', objeto: ext('O'), proceso: x('P').texto, ...(id === 'FAN5e' ? { entrada: estado.texto } : id === 'FAN5A' ? { entrada: x('e').texto, salida: estado.texto } : { salida: estado.texto }) });
        }
        else if (id === 'FAN4' || id === 'CFE') {
            for (const p of lista(h, 'Plista'))
                ramas.push({ tipo: 'efecto', objeto: ext('O'), proceso: p.texto, control: id === 'FAN4' ? 'e' : 'c' });
        }
        else if (id === 'C18') {
            for (const obj of lista(h, 'Olista'))
                ramas.push({ tipo: 'consumo', objeto: extremo(obj), proceso: x('P').texto, control: 'c' });
        }
        else {
            const [, tipo, direccion] = id.split('-');
            if (tipo === 'invocacion') {
                for (const p of lista(h, 'Plista'))
                    ramas.push({ tipo: 'invocacion', origen: direccion === 'convergente' ? p.texto : x('P').texto, destino: direccion === 'convergente' ? x('P').texto : p.texto });
            }
            else {
                const porP = tipo === 'resultado' ? direccion === 'divergente' : direccion === 'convergente';
                const objs = porP ? lista(h, 'Olista') : [x('O')], ps = porP ? [x('P')] : lista(h, 'Plista');
                for (const obj of objs)
                    for (const p of ps)
                        ramas.push({ tipo: tipo as 'consumo' | 'resultado' | 'efecto' | 'agente' | 'instrumento', objeto: extremo(obj), proceso: p.texto });
            }
        }
        return [{ k: 'abanico', operador, ramas }];
    }
    if (id.startsWith('CX')) {
        if (id === 'CX3' || id === 'CX3s')
            return [{ k: 'despliegue', cosa: nombre('vertice'), ...(h.opd ? { opdHijo: x('opd').texto } : {}), refinadores: [...lista(h, 'C'), ...lista(h, 'otro')].map(v => ({ nombre: v.texto, tipo: v.marca === 'proceso' ? 'proceso' : 'objeto' })) }];
        const ps = lista(h, 'Plista');
        const bandas = id === 'CX2' ? [ps.map(p => p.texto)] : h.SEC ? x('SEC').bandas?.map(b => b.map(p => p.texto)) ?? [] : ps.map(p => [p.texto]);
        return [{ k: 'descomposicion', proceso: x('P').texto, bandas, internos: lista(h, 'O').map(o => o.texto), ...(h.opd ? { opdHijo: x('opd').texto } : {}), ...(h.padre ? { opdPadre: x('padre').texto } : {}) }];
    }
    if (id === 'RH1')
        return lista(h, 'articulos').map(p => ({ k: 'enlace', enlace: { tipo: 'generalizacion', refinable: extremo(p), refinador: ext('C') } }));
    if (id.startsWith('RF') || id === 'RH1') {
        const result: HechoTexto[] = [];
        const hijos = id === 'RF2b' || id === 'RF2i' ? [...lista(h, 'C'), ...lista(h, 'otro')] : lista(h, id === 'RFE' ? 'Oe' : 'C');
        const t = id.startsWith('RF1') ? 'agregacion' : id.startsWith('RF2') ? 'exhibicion' : id.startsWith('RF4') ? 'clasificacion' : 'generalizacion';
        for (const hijo of hijos) {
            const padre = x(id === 'RFE' ? 'O' : id.startsWith('RF1') || id.startsWith('RF2') ? 'vertice' : 'general');
            result.push({ k: 'enlace', enlace: { tipo: t, refinable: { ...extremo(padre), ...(id === 'RFE' ? { estado: x('s').texto } : {}) }, refinador: extremo(hijo) } });
        }
        if (id.endsWith('i'))
            result.push({ k: 'incompleta', cosa: nombre(t === 'generalizacion' ? 'general' : 'vertice'), relacion: t as 'agregacion' | 'exhibicion' | 'generalizacion' });
        return result;
    }
    if (id === 'SSE5')
        return [{ k: 'enlace', enlace: { tipo: 'etiquetado', origen: ext('O2'), destino: { ...ext('O1'), estado: x('a').texto }, etiqueta: x('t2').texto } }];
    if (/^S?SE/.test(id)) {
        const reciproco = ['SE4', 'SE5', 'SSE6', 'SSE7'].includes(id);
        const origen = ext(h.O1 ? 'O1' : 'C1'), destino = ext(h.O2 ? 'O2' : 'C2');
        return [{ k: 'enlace', enlace: { tipo: reciproco ? 'reciproco' : 'etiquetado', origen: { ...origen, ...(h.a ? { estado: x('a').texto } : {}) }, destino: { ...destino, ...(h.b ? { estado: x('b').texto } : {}) }, ...(h.t ? { etiqueta: x('t').texto } : {}) } }];
    }
    throw new Error(`Reconocimiento no definido para ${id}`);
}
/** La secuencia conserva cada banda; solo los miembros de una banda se ordenan por nombre. */
export function datosContexto(m: Modelo, opd: string): HechoGenerable | null {
    const d = m.opds[opd]!;
    if (d.tipo === 'raiz')
        return null;
    const cmp = (a: string, b: string) => m.cosas[a]!.nombre.localeCompare(m.cosas[b]!.nombre, 'es', { sensitivity: 'base' }) || a.localeCompare(b);
    const idx = indice(m);
    if (d.tipo === 'descomposicion') {
        if (d.bandas.flat().length < 2)
            return null;
        const bandas = d.bandas.map(b => [...b].sort(cmp));
        const h: Record<string, ValorHueco> = { P: cosa(m, d.cosa), O: [...d.objetosInternos].sort(cmp).map(id => cosa(m, id)) };
        let id = bandas.every(b => b.length === 1) ? 'CX1' : bandas.length === 1 ? 'CX2' : 'CXM';
        if (id === 'CXM') {
            const tokens: TokenOpl[] = [];
            bandas.forEach((b, i) => { if (i)
                tokens.push({ texto: i === bandas.length - 1 ? `, ${conjuncionY(b.length > 1 ? 'paralelo' : m.cosas[b[0]!]!.nombre)} ` : ', ', rol: 'texto' }); if (b.length > 1)
                tokens.push({ texto: 'paralelo ', rol: 'texto' }); b.forEach((id, j) => { if (j)
                tokens.push({ texto: j === b.length - 1 ? ` ${conjuncionY(m.cosas[id]!.nombre)} ` : ', ', rol: 'texto' }); const c = cosa(m, id); tokens.push({ texto: c.texto, rol: 'nombre', ...(c.marca ? { marca: c.marca } : {}), ...(c.ref ? { ref: c.ref } : {}) }); }); });
            h.SEC = { texto: '', tokens, bandas: bandas.map(b => b.map(id => cosa(m, id))) };
        }
        else
            h.Plista = bandas.flat().map(id => cosa(m, id));
        // P es el contenedor y Plista la colección; no comparten un hueco ambiguo.
        return { plantilla: id, huecos: h };
    }
    const refinadores = [...new Set(Object.values(m.enlaces).filter(e => 'refinable' in e && e.tipo === d.modo && e.refinable === d.cosa).map(e => (e as Extract<Enlace, {
        refinador: string;
    }>).refinador).filter(id => Object.hasOwn(d.apariciones, id)))];
    if (refinadores.length < 2)
        return null;
    const tipo = m.cosas[d.cosa]!.tipo, principal = refinadores.filter(id => m.cosas[id]!.tipo === tipo).sort(cmp), otros = refinadores.filter(id => m.cosas[id]!.tipo !== tipo).sort(cmp);
    return { plantilla: 'CX3', huecos: { vertice: cosa(m, d.cosa), C: (principal.length ? principal : otros).map(id => cosa(m, id)), otro: principal.length ? otros.map(id => cosa(m, id)) : [], opd: { texto: idx.etiqueta.get(opd)!, ref: { tipo: 'opd', id: opd } } } };
}
