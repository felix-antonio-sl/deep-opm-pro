import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
// ---------- Salida del analizador (por nombres; no conoce el modelo) ----------
export interface NombreTipado {
    readonly nombre: string;
    readonly tipo: TipoCosa;
    readonly genero?: 'f';
}
export interface ExtremoTexto extends NombreTipado {
    readonly estado?: string;
    readonly mult?: Multiplicidad;
    readonly genero?: 'f';
    readonly cualquierEstado?: true;
}
export type EnlaceTexto = {
    readonly tipo: 'consumo' | 'resultado' | 'agente' | 'instrumento';
    readonly objeto: ExtremoTexto;
    readonly proceso: string;
    readonly control?: Control;
    readonly ruta?: string;
} | {
    readonly tipo: 'efecto';
    readonly objeto: ExtremoTexto;
    readonly proceso: string;
    readonly entrada?: string;
    readonly salida?: string;
    readonly control?: Control;
} | {
    readonly tipo: 'invocacion' | 'excepcionSobretiempo' | 'excepcionSubtiempo';
    readonly origen: string;
    readonly destino: string;
} | {
    readonly tipo: 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
    readonly refinable: ExtremoTexto;
    readonly refinador: ExtremoTexto;
} // estados solo en generalización (RFE)
 | {
    readonly tipo: 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco';
    readonly origen: ExtremoTexto;
    readonly destino: ExtremoTexto;
    readonly etiqueta?: string;
    readonly inversa?: string;
};
export type HechoTexto = {
    readonly k: 'esencia';
    readonly cosa: NombreTipado;
    readonly valor: Esencia;
} | {
    readonly k: 'afiliacion';
    readonly cosa: NombreTipado;
    readonly valor: Afiliacion;
} | {
    readonly k: 'mencion';
    readonly cosa: NombreTipado;
} // D11/D12 coherentes: existencia; D2 y D4 conservan sus dimensiones.
 | {
    readonly k: 'estados';
    readonly objeto: string;
    readonly nombres: readonly string[];
    readonly otros: boolean;
} | {
    readonly k: 'designacion';
    readonly objeto: string;
    readonly estado: string;
    readonly designaciones: readonly Designacion[];
} | {
    readonly k: 'valor';
    readonly atributo: string;
    readonly exhibidor: string;
    readonly valor: string;
} | {
    readonly k: 'cota';
    readonly proceso: string;
    readonly campo: 'max' | 'min';
    readonly n: number;
    readonly unidad: UnidadTiempo;
} | {
    readonly k: 'enlace';
    readonly enlace: EnlaceTexto;
} | {
    readonly k: 'abanico';
    readonly operador: Operador;
    readonly ramas: readonly EnlaceTexto[];
} | {
    readonly k: 'incompleta';
    readonly cosa: NombreTipado;
    readonly relacion: RelacionIncompleta;
} | {
    readonly k: 'descomposicion';
    readonly proceso: string;
    readonly bandas: readonly (readonly string[])[];
    readonly internos: readonly string[];
    readonly opdPadre?: string;
    readonly opdHijo?: string;
} | {
    readonly k: 'despliegue';
    readonly cosa: NombreTipado;
    readonly opdHijo?: string;
    readonly refinadores: readonly NombreTipado[];
};
export type CodigoOpl = 'syntax-error' | 'unknown-symbol' | 'ambiguous-symbol' | 'type-mismatch' | 'patch-conflict' | 'unsupported-canonical' | 'non-canonical' | 'no-delete-by-absence';
export interface DiagOpl {
    readonly codigo: CodigoOpl;
    readonly severidad: Severidad;
    readonly linea: number;
    readonly mensaje: string;
    readonly regla?: string;
}
export interface LineaAnalizada {
    readonly numero: number;
    readonly texto: string;
    readonly vacia: boolean;
    readonly cabecera?: string; // '## SD1 …' ⇒ 'SD1' (solo contexto, T-185)
    readonly plantilla?: string;
    readonly hechos: readonly HechoTexto[];
    readonly diagnosticos: readonly DiagOpl[];
}


import { PLANTILLAS } from './plantillas';
import type { Plantilla, Hueco, Huecos, ValorHueco } from './plantillas';
import { NO_SOPORTADAS, NO_CANONIZADAS } from './no-soportadas';

interface Span { readonly texto: string; readonly marca: 'objeto' | 'proceso' | 'estado'; }
const atom = '§\\d+§';
// DEC35: «al menos dos» y «dos o más» son 2..*; el entero exacto va desde 2 (B-10 conserva los demás).
const prefijo = '(?:(?:un opcional|una opcional|al menos un|al menos una|al menos dos|dos o más|opcional \\(cero o más\\)|[2-9]|[1-9]\\d{1,5}) )?';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
function literal(s: string,inicial=false): string {
    const letras=(x:string)=>{const re=escape(x);return inicial?re.replace(/\p{L}/gu,c=>c.toLowerCase()===c.toUpperCase()?c:'['+c.toLowerCase()+c.toUpperCase()+']'):re;};
    return s.split(/([\p{L}]+(?:\|[\p{L}]+)+)/u).map(x=>x.includes('|')?'(?:'+x.split('|').map(letras).join('|')+')':x.split(/( y | o )/).map(t=>t===' y '?inicial?' [yeYE] ':' [ye] ':t===' o '?inicial?' [ouOU] ':' [ou] ':letras(t)).join('')).join('');
}
function slot(k: string,inicial=false): string {
    if (k === 'Q' || k === 'Q^') return '(?:[Ee]xactamente uno de|[Aa]l menos uno de)';
    if (k === 'SEC') return '.+?';
    const name = k.replace(/^(Ly|Lo|Lista):/, '');
    const list = name !== k, mult = name.startsWith('m'), estado = name.endsWith('e') && name !== 'e';
    if (['r', 't', 't2', 'v', 'esencia', 'afiliacion', 'u', 'n', 'opd', 'padre'].includes(name)) return '.+?';
    const prefijoInicial=prefijo.replace(/un opcional/g,'[Uu]n opcional').replace(/una opcional/g,'[Uu]na opcional').replace(/al menos/g,'[Aa]l menos').replace('dos o más','[Dd]os o más').replace('opcional '+String.fromCharCode(92)+'(','[Oo]pcional '+String.fromCharCode(92)+'(');
    const item = (mult ? inicial?prefijoInicial:prefijo : name === 'articulos' ? '(?:un|una) ' : '') + atom + '(?: proceso)?' + (estado ? '(?: en ' + atom + ')?' : '');
    return list ? item + '(?:(?:, | [yeou] )' + item + ')*' : item;
}
function compilar(p: Plantilla) {
    const keys: string[] = [];let primerLiteral=true;
    const tramo=(s:string)=>{const esPrimero=primerLiteral&&/\p{L}/u.test(s);if(esPrimero)primerLiteral=false;return literal(s,esPrimero);};
    function fragmento(s: string): string {
        let out = '', fin = 0;
        for (const m of s.matchAll(/\[([^\[\]]+)\]|\{([^}]+)\}/g)) {
            out += tramo(s.slice(fin, m.index));
            if (m[1] !== undefined){const antes=primerLiteral;out += '(?:' + fragmento(m[1]) + ')?';primerLiteral=antes;}
            else { keys.push(m[2]!); out += '(' + slot(m[2]!,primerLiteral) + ')'; }
            fin = m.index! + m[0].length;
        }
        return out + tramo(s.slice(fin));
    }
    return { p, keys, re: new RegExp('^' + fragmento(p.patron) + '$', 'u'), peso: p.patron.replace(/\{[^}]+\}/g, '').length };
}
// Esqueletos específicos primero; SE1/SSE residuales nunca capturan un literal reservado.
const esqueletos = PLANTILLAS.map(compilar).sort((a, b) => {
    const residual = (id: string) => /^(?:SE[13]|SSE[12345])$/.test(id) ? 1 : 0;
    return residual(a.p.id) - residual(b.p.id) || b.peso - a.peso;
});
function nombres(texto: string): { plano: string; spans: Span[] } | null {
    const spans: Span[] = [];
    const plano = texto.replace(/\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g, (_, o: string, p: string, e: string) => {
        // Current es un literal del esqueleto, no un nombre de estado.
        if (e === 'Current') return '`Current`';
        const n = (o ?? p ?? e).trim().replace(p ? / proceso$/ : /$^/, '');
        const i = spans.push({ texto: n, marca: o !== undefined ? 'objeto' : p !== undefined ? 'proceso' : 'estado' }) - 1;
        return `§${i}§`;
    });
    return /[*`]/.test(plano.replace('`Current`', '')) ? null : { plano, spans };
}
function capturar(k: string, s: string, spans: readonly Span[]): ValorHueco | null {
    if (k === 'Q' || k === 'Q^') return { texto: s.toLowerCase().startsWith('exactamente') ? 'XOR' : 'OR' };
    if (k === 'SEC') {
        // Los separadores sólo existen fuera de los spans; un nombre con y no se corta.
        const parts = [...s.matchAll(/(paralelo )?§(\d+)§(?: proceso)?/g)];
        if (!parts.length) return null;
        const bandas: Hueco[][] = []; let actual: Hueco[] | null = null;
        for (let i = 0; i < parts.length; i++) {
            const m = parts[i]!, span = spans[Number(m[2])]!;
            if (span.marca !== 'proceso') return null;
            const previo = i ? parts[i - 1]! : undefined;
            const sep = s.slice(previo ? previo.index! + previo[0].length : 0, m.index);
            if (!/^(?:,? ?[ye]? ?)?$/.test(sep)) return null;
            if (m[1]) { actual = []; bandas.push(actual); }
            else if (!actual) { actual = []; bandas.push(actual); }
            actual.push(span);
            if (!m[1] && (actual.length === 1 || / [ye] /.test(sep))) actual = null;
        }
        const ultimo = parts.at(-1)!;
        if (s.slice(ultimo.index! + ultimo[0].length)) return null;
        return { texto: s, bandas };
    }
    const name = k.replace(/^(Ly|Lo|Lista):/, ''), base = name.replace(/^m/, '').replace(/e$/, '');
    if (['r', 't', 't2', 'v', 'esencia', 'afiliacion', 'u', 'n', 'opd', 'padre'].includes(name)) {
        if (s.includes('§')) return null;
        if (name === 'n' && !/^\d+(?:\.\d+)?$/.test(s)) return null;
        if (name === 'v' && !/^(?:[\p{L}][\p{L}\d_-]*|-?(?:0|[1-9]\d*)(?:\.\d+)?)$/u.test(s)) return null;
        if ((name === 't' || name === 't2') && !/^[\p{Ll}][\p{Ll}\d_-]*(?: [\p{Ll}][\p{Ll}\d_-]*)*$/u.test(s)) return null;
        if (name === 'esencia' && !/^(?:físico|física|informacional)$/.test(s)) return null;
        if (name === 'afiliacion' && !/^(?:ambiental|sistémico|sistémica)$/.test(s)) return null;
        return { texto: s };
    }
    const valores: Hueco[] = [];
    for (const m of s.matchAll(/(?:(un opcional|una opcional|al menos un|al menos una|al menos dos|dos o más|opcional \(cero o más\)|[2-9]|[1-9]\d{1,5}|un|una) )?§(\d+)§(?: proceso)?(?: en §(\d+)§)?/gi)) {
        const modificador = m[1]?.toLowerCase();
        const span = spans[Number(m[2])]!, e = m[3] ? spans[Number(m[3])] : undefined;
        const esperado = ['s','e','a','b'].includes(name) ? 'estado' : /^(?:O|Olista)/.test(base) ? 'objeto' : /^(?:P|Plista)/.test(base) ? 'proceso' : undefined;
        if (esperado && span.marca !== esperado || e && e.marca !== 'estado') return null;
        const mult: Multiplicidad | undefined = !modificador ? undefined : modificador.includes('opcional') ? modificador.startsWith('opcional') ? '*' : '?'
            : modificador === 'al menos dos' || modificador === 'dos o más' ? '2..*' : modificador.startsWith('al menos') ? '+' : /^\d+$/.test(modificador) ? modificador as Multiplicidad : undefined;
        valores.push({ ...span, ...(modificador?.includes('una') ? { genero: 'f' as const } : {}), ...(mult ? { mult } : {}), ...(e ? { estado: e } : {}) });
    }
    if (!valores.length) return null;
    return name !== k ? valores : valores.length === 1 ? valores[0]! : null;
}
function congelarHecho<T>(x:T):T {
    if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))congelarHecho(v);Object.freeze(x);}return x;
}
const memoLineas = new Map<string, { plantilla: string; hechos: readonly HechoTexto[] } | null>();
function reconocerLinea(texto: string): { plantilla: string; hechos: readonly HechoTexto[] } | null {
    if (memoLineas.has(texto)) return memoLineas.get(texto)!;
    if (memoLineas.size >= 2048) memoLineas.clear();
    const tokens = nombres(texto); if (!tokens) return null;
    for (const { p, re, keys } of esqueletos) {
        const match = re.exec(tokens.plano); if (!match) continue;
        const h: Record<string, ValorHueco> = {}; let valido = true;
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]!, s = match[i + 1]; if (s === undefined) continue;
            const v = capturar(k, s, tokens.spans); if (!v) { valido = false; break; }
            let name = k === 'Q' || k === 'Q^' ? 'operador' : k.replace(/^(Ly|Lo|Lista):/, '');
            if (name.startsWith('m')) name = name.slice(1).replace(/^(O|Olista)e$/, '$1');
            if (h[name]) {
                const anterior = h[name]!;
                const identidad = (x: ValorHueco) => Array.isArray(x) ? JSON.stringify(x) : JSON.stringify({ texto: (x as Hueco).texto, marca: (x as Hueco).marca });
                if (identidad(anterior) !== identidad(v)) { valido = false; break; }
                continue;
            }
            h[name] = v;
        }
        if (!valido || !p.restricciones?.(h)) continue;
        if((p.id==='SE1'||p.id==='SE3')&&(h.C1 as Hueco)?.marca!==(h.C2 as Hueco)?.marca)continue;
        if ((p.id === 'D1' || p.id === 'D4') && / es (?:física|sistémica)\.$/.test(texto)) h.C = { ...(h.C as Hueco), genero: 'f' };
        if (p.id.endsWith('-XOR') && (h.operador as Hueco).texto !== 'XOR' || p.id.endsWith('-OR') && (h.operador as Hueco).texto !== 'OR') continue;
        if (p.id === 'RF3b' && / es una /.test(tokens.plano)) h.general = { ...(h.general as Hueco), genero: 'f' };
        const hechos = congelarHecho(p.hacia(h));
        if (hechos.length) { const r = { plantilla: p.id, hechos }; memoLineas.set(texto,r); return r; }
    }
    memoLineas.set(texto,null); return null;
}
const HECHOS_VACIOS:readonly HechoTexto[]=Object.freeze([]);
const DIAGS_VACIOS:readonly DiagOpl[]=Object.freeze([]);
const memoAnalisis = new Map<string, readonly LineaAnalizada[]>();
const memoClasificacion = new Map<string, {hechos:readonly HechoTexto[];plantilla?:string;diagnosticos:readonly DiagOpl[]}>();
export function analizar(texto: string): readonly LineaAnalizada[] {
    const previo = memoAnalisis.get(texto); if (previo) return previo;
    const resultado = texto.normalize('NFC').replace(/\r\n?/g, '\n').split('\n').map((original, i) => {
        const normal = /[“”‘’≤≥≠∈]/u.test(original) ? original.replace(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)|[“”‘’≤≥≠∈]/gu,(x,span)=>span??({'“':'"','”':'"','‘':"'",'’':"'",'≤':'<=','≥':'>=','≠':'!=','∈':'in'} as Record<string,string>)[x]!) : original;
        const s = normal.replace(/[\t\u00a0]+/g, ' ').replace(/ +/g, ' ').trim().replace(/^(?:[-•] |\d+[.)] )/, ''), numero = i + 1;
        const base = { numero, texto: s, vacia: !s, hechos: HECHOS_VACIOS, diagnosticos: DIAGS_VACIOS };
        if (!s || /^# /.test(s)) return base;
        const cab = /^## (SD(?:[1-9]\d*(?:\.[1-9]\d*)*)?)(?: .*)?$/.exec(s);
        if (cab) return { ...base, cabecera: cab[1]! };
        const diag = (codigo: CodigoOpl, mensaje: string, regla?: string): LineaAnalizada => ({ ...base, diagnosticos: [{ codigo, severidad: codigo === 'unsupported-canonical' ? 'warning' : 'error', linea: numero, mensaje, ...(regla ? { regla } : {}) }] });
        if (!s.endsWith('.') && !/\. \[etiqueta: [^\]]+\]$/.test(s)) return diag('syntax-error', 'La oración OPL-ES debe terminar en punto.');
        let clasificacion=memoClasificacion.get(s);
        if(!clasificacion){
            // Los límites leen gramática y tipografía, nunca contenido de nombres/estados/ruta.
            const superficieLimites = s.replace(/\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`/gu,span=>span.startsWith('**')?'**N**':span.startsWith('*')?'*N*':'`s`').replace(/^Por ruta [^,\n]+, /u,'Por ruta R, ');
            const no = [...NO_CANONIZADAS,...NO_SOPORTADAS].find(x => x.patron.test(superficieLimites));
            const r = no ? diag(no.codigo, 'Construcción fuera del subconjunto inverso soportado.', no.regla) : reconocerLinea(s);
            clasificacion=no?{hechos:HECHOS_VACIOS,diagnosticos:(r as LineaAnalizada).diagnosticos.map(d=>({...d,linea:0}))}:r?{...r,diagnosticos:[]}:{hechos:HECHOS_VACIOS,diagnosticos:[{codigo:'syntax-error',severidad:'error',linea:0,mensaje:'Forma OPL no reconocida.'}]};
            if(memoClasificacion.size>=2048)memoClasificacion.delete(memoClasificacion.keys().next().value!);
            memoClasificacion.set(s,clasificacion);
        }
        return {...base,...clasificacion,diagnosticos:clasificacion.diagnosticos.length?clasificacion.diagnosticos.map(d=>({...d,linea:numero})):DIAGS_VACIOS};
    });
    if (memoAnalisis.size >= 256) memoAnalisis.delete(memoAnalisis.keys().next().value!);
    for(const l of resultado){if(l.diagnosticos!==DIAGS_VACIOS){for(const d of l.diagnosticos)Object.freeze(d);Object.freeze(l.diagnosticos);}Object.freeze(l);}
    Object.freeze(resultado);memoAnalisis.set(texto, resultado); return resultado;
}
