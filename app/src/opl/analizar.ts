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


import { PLANTILLAS, patronProducto } from './plantillas';
import type { Plantilla, Hueco, Huecos, ValorHueco } from './plantillas';
import { NO_SOPORTADAS, NO_CANONIZADAS } from './no-soportadas';
import { validarEtiqueta } from '../nucleo/lexico';
import { esParametroMultiplicidad, multiplicidadEnExtremo, PATRON_PARAMETRO_MULTIPLICIDAD } from '../nucleo/matriz';

interface Span { readonly texto: string; readonly marca: 'objeto' | 'proceso' | 'estado'; }
const atom = '§\\d+§';
// DEC35: «al menos dos» y «dos o más» son 2..*; el entero exacto va desde 2 (B-10 conserva los demás).
const identificadorCantidad = PATRON_PARAMETRO_MULTIPLICIDAD;
const parametroCantidad = '(?:«' + identificadorCantidad + '»|' + identificadorCantidad + ')';
const prefijo = '(?:(?:un opcional|una opcional|al menos un|al menos una|al menos dos|dos o más|opcional \\(cero o más\\)|muchos|muchas|[2-9]|[1-9]\\d+|' + parametroCantidad + ') )?';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
function literal(s: string,inicial=false): string {
    const letras=(x:string)=>{const re=escape(x);return inicial?re.replace(/\p{L}/gu,c=>c.toLowerCase()===c.toUpperCase()?c:'['+c.toLowerCase()+c.toUpperCase()+']'):re;};
    return s.split(/([\p{L}]+(?:\|[\p{L}]+)+)/u).map(x=>x.includes('|')?'(?:'+x.split('|').map(letras).join('|')+')':x.split(/( y | o )/).map(t=>t===' y '?inicial?' [yeYE] ':' [ye] ':t===' o '?inicial?' [ouOU] ':' [ou] ':letras(t)).join('')).join('');
}
function slot(k: string,inicial=false,listaAnd=false,tagCodicioso=false,pospuestoPrimero=false): string {
    if (k === 'Q' || k === 'Q^') return '(?:[Ee]xactamente uno de|[Aa]l menos uno de)';
    if (k === 'SEC') return '.+?';
    const name = k.replace(/^(Ly|Lo|Lista):/, '');
    const list = name !== k, mult = name.startsWith('m'), estado = name.endsWith('e') && name !== 'e';
    if (name === 't' || name === 't2') return tagCodicioso ? '.+' : '.+?';
    if (['r', 'v', 'esencia', 'afiliacion', 'u', 'n', 'opd', 'padre'].includes(name)) return '.+?';
    const prefijoInicial=prefijo.replace(/un opcional/g,'[Uu]n opcional').replace(/una opcional/g,'[Uu]na opcional').replace(/al menos/g,'[Aa]l menos').replace('dos o más','[Dd]os o más').replace('opcional '+String.fromCharCode(92)+'(','[Oo]pcional '+String.fromCharCode(92)+'(');
    const cambio = name === 'cambios' || name === 'entradas' || name === 'salidas';
    const nombre = atom + '(?: proceso)?' + (estado ? '(?: en ' + atom + ')?' : '');
    const variantes = [(inicial ? prefijoInicial : prefijo) + nombre, (inicial ? '(?:[Uu]n|[Uu]na) ' : '(?:un|una) ') + nombre + ' opcional', nombre + ' opcionales'];
    if (pospuestoPrimero) variantes.reverse();
    const item = cambio ? atom + (name !== 'salidas' ? ' de ' + atom : '') + (name !== 'entradas' ? ' a ' + atom : '')
        : mult ? '(?:' + variantes.join('|') + ')'
            : (name === 'articulos' ? '(?:un|una) ' : '') + nombre;
    const conjuncion = k.startsWith('Ly:') ? '[ye]' : k.startsWith('Lo:') ? '[ou]' : '[yeou]';
    // A.4.3: las listas AND nuevas cierran con una sola conjunción; los spans son opacos.
    if (list && listaAnd) return item + '(?:, ' + item + ')* ' + conjuncion + ' ' + item;
    return list ? item + '(?:(?:, | ' + conjuncion + ' )' + item + ')*' : item;
}
function compilar(p: Plantilla, tagCodicioso=false, pospuestoPrimero=false) {
    const keys: string[] = [];let primerLiteral=true;
    const tramo=(s:string)=>{const esPrimero=primerLiteral&&/\p{L}/u.test(s);if(esPrimero)primerLiteral=false;return literal(s,esPrimero);};
    function fragmento(s: string): string {
        let out = '', fin = 0;
        for (const m of s.matchAll(/\[([^\[\]]+)\]|\{([^}]+)\}/g)) {
            out += tramo(s.slice(fin, m.index));
            if (m[1] !== undefined){const antes=primerLiteral;out += '(?:' + fragmento(m[1]) + ')?';primerLiteral=antes;}
            else { keys.push(m[2]!); out += '(' + slot(m[2]!,primerLiteral,p.id.startsWith('AND-') || p.id === 'SE1L' || p.id === 'SE2L',tagCodicioso,pospuestoPrimero) + ')'; }
            fin = m.index! + m[0].length;
        }
        return out + tramo(s.slice(fin));
    }
    return { p, keys, re: new RegExp('^' + fragmento(p.patron) + '$', 'du'), peso: p.patron.replace(/\{[^}]+\}/g, '').length };
}
// Esqueletos específicos primero; SE1/SSE residuales nunca capturan un literal reservado.
const esqueletos = PLANTILLAS.flatMap(p => {
    const variantes = (patron: string, marcada: boolean, codicioso=false, pospuesto=false) => {
        const original = { ...compilar({ ...p, patron },codicioso,pospuesto), p, marcada, estadoSeparado: undefined as string | undefined };
        const separado = /\{mO\} en \{([es])\}/.exec(patron);
        if (!separado) return [original];
        const unido = compilar({ ...p, patron: patron.replace(separado[0], '{mOe}') });
        return [original, { ...unido, p, marcada, estadoSeparado: separado[1] }];
    };
    if (p.familia !== 'etiquetada') return variantes(p.patron, false);
    const marcado = patronProducto(p);
    return [...variantes(marcado, true), ...variantes(p.patron, false),
        ...variantes(p.patron, false, true), ...variantes(p.patron, false, false, true), ...variantes(p.patron, false, true, true)];
}).sort((a, b) => {
    const residual = (id: string) => /^(?:SE[13]|SE1L|SSE[12345])$/.test(id) ? 1 : 0;
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
function capturar(k: string, s: string, spans: readonly Span[], parametro?: (desde: number, hasta: number) => void): ValorHueco | null {
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
    if (name === 'cambios' || name === 'entradas' || name === 'salidas') {
        const re = new RegExp('§(\\d+)§' + (name !== 'salidas' ? ' de §(\\d+)§' : '') + (name !== 'entradas' ? ' a §(\\d+)§' : ''), 'g');
        const valores: Hueco[] = [];
        for (const m of s.matchAll(re)) {
            const objeto = spans[Number(m[1])]!, entrada = name !== 'salidas' ? spans[Number(m[2])] : undefined;
            const salida = name !== 'entradas' ? spans[Number(m[name === 'salidas' ? 2 : 3])] : undefined;
            if (objeto.marca !== 'objeto' || entrada && entrada.marca !== 'estado' || salida && salida.marca !== 'estado') return null;
            valores.push({ ...objeto, ...(entrada ? { entrada } : {}), ...(salida ? { salida } : {}) });
        }
        return valores.length ? valores : null;
    }
    if (['r', 't', 't2', 'v', 'esencia', 'afiliacion', 'u', 'n', 'opd', 'padre'].includes(name)) {
        if (s.includes('§')) return null;
        if (name === 'n' && !/^\d+(?:\.\d+)?$/.test(s)) return null;
        if (name === 'v' && !/^(?:[\p{L}][\p{L}\d_-]*|-?(?:0|[1-9]\d*)(?:\.\d+)?)$/u.test(s)) return null;
        // El léxico de etiqueta vive en el núcleo (R-OPL-LEX-2); el analizador no lo duplica.
        if ((name === 't' || name === 't2') && validarEtiqueta(s)) return null;
        if (name === 'esencia' && !/^(?:físico|física|informacional)$/.test(s)) return null;
        if (name === 'afiliacion' && !/^(?:ambiental|sistémico|sistémica)$/.test(s)) return null;
        return { texto: s };
    }
    const valores: Hueco[] = [];
    const cantidad = new RegExp('(?:(un opcional|una opcional|al menos un|al menos una|al menos dos|dos o más|opcional \\(cero o más\\)|muchos|muchas|[2-9]|[1-9]\\d+|'+parametroCantidad+') )?§(\\d+)§(?: proceso)?(?: en §(\\d+)§)?(?: (opcionales|opcional))?', 'iy');
    let cursor = 0;
    while (cursor < s.length) {
        if (valores.length) {
            const separador = /^(?:, | [yeou] )/.exec(s.slice(cursor));
            if (!separador) return null;
            cursor += separador[0].length;
        }
        cantidad.lastIndex = cursor;
        const m = cantidad.exec(s); if (!m) return null;
        cursor = cantidad.lastIndex;
        const modificador = m[1]?.toLowerCase();
        const delimitado = m[1]?.startsWith('«') ? m[1].slice(1, -1) : undefined;
        const span = spans[Number(m[2])]!, e = m[3] ? spans[Number(m[3])] : undefined;
        const esperado = ['s','e','a','b'].includes(name) ? 'estado' : /^(?:O|Olista)/.test(base) ? 'objeto' : /^(?:P|Plista)/.test(base) ? 'proceso' : undefined;
        if (esperado && span.marca !== esperado || e && e.marca !== 'estado') return null;
        const pospuesto = m[4]?.toLowerCase();
        if (pospuesto === 'opcional' && !['un', 'una'].includes(modificador ?? '') || pospuesto === 'opcionales' && modificador) return null;
        if (name.startsWith('m') && ['un','una'].includes(modificador ?? '') && !pospuesto) return null;
        const mult: Multiplicidad | undefined = delimitado !== undefined ? esParametroMultiplicidad(delimitado) ? delimitado : undefined
            : pospuesto === 'opcional' ? '?' : pospuesto === 'opcionales' ? '*' : !modificador ? undefined
                : modificador === 'opcional (cero o más)' ? '*' : ['un opcional', 'una opcional'].includes(modificador) ? '?'
            : modificador === 'al menos dos' || modificador === 'dos o más' ? '2..*' : modificador.startsWith('al menos') ? '+'
                : ['muchos','muchas'].includes(modificador) ? 'muchos' : /^\d+$/.test(modificador) ? modificador : esParametroMultiplicidad(m[1]!) ? m[1] : undefined;
        if (name.startsWith('m') && modificador && mult === undefined) return null;
        if (mult && esParametroMultiplicidad(mult)) parametro?.(m.index, m.index + m[1]!.length);
        valores.push({ ...span, ...(/(?:^| )una(?: |$)|^muchas$/.test(modificador ?? '') ? { genero: 'f' as const } : {}), ...(mult ? { mult } : {}), ...(e ? { estado: e } : {}) });
    }
    if (!valores.length) return null;
    return name !== k ? valores : valores.length === 1 ? valores[0]! : null;
}
function congelarHecho<T>(x:T):T {
    if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))congelarHecho(v);Object.freeze(x);}return x;
}
type Reconocimiento = { plantilla: string; hechos: readonly HechoTexto[]; ambigua?: true; superficieLimites?: string };
function superficieParaLimites(texto: string): string {
    return texto.replace(/\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|«[^«»]+»/gu,
        span => span.startsWith('**') ? '**N**' : span.startsWith('*') ? '*N*' : span.startsWith('«') ? '«etiqueta»' : '`s`')
        .replace(/^Por ruta [^,\n]+, /u, 'Por ruta R, ');
}
const memoLineas = new Map<string, Reconocimiento | null>();
function reconocerLinea(texto: string): Reconocimiento | null {
    if (memoLineas.has(texto)) return memoLineas.get(texto)!;
    if (memoLineas.size >= 2048) memoLineas.clear();
    const tokens = nombres(texto); if (!tokens) return null;
    const lecturas = new Map<string, Reconocimiento>();
    const firma = (hechos: readonly HechoTexto[]) => {
        const normalizar = (v: unknown): unknown => {
            if (Array.isArray(v)) return v.map(normalizar);
            if (!v || typeof v !== 'object') return v;
            const x = v as Record<string, unknown>;
            return Object.fromEntries(Object.keys(x).sort().filter(k => k !== 'genero'
                && !(k === 'etiqueta' && x.tipo === 'etiquetado' && x.etiqueta === 'se relaciona con')).map(k => [k, normalizar(x[k])]));
        };
        return JSON.stringify(normalizar(hechos));
    };
    for (const { p, re, keys, estadoSeparado, marcada } of esqueletos) {
        const match = re.exec(tokens.plano); if (!match) continue;
        const h: Record<string, ValorHueco> = {}; let valido = true;
        const parametros: { desde: number; hasta: number }[] = [];
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]!, s = match[i + 1]; if (s === undefined) continue;
            const inicio = match.indices![i + 1]![0];
            const v = capturar(k, s, tokens.spans, (desde, hasta) => parametros.push({ desde: inicio + desde, hasta: inicio + hasta }));
            if (!v) { valido = false; break; }
            let name = k === 'Q' || k === 'Q^' ? 'operador' : k.replace(/^(Ly|Lo|Lista):/, '');
            if (name.startsWith('m')) name = name.slice(1).replace(/^(O|Olista|C[12])e$/, '$1');
            if (h[name]) {
                const anterior = h[name]!;
                const identidad = (x: ValorHueco) => Array.isArray(x) ? JSON.stringify(x) : JSON.stringify({ texto: (x as Hueco).texto, marca: (x as Hueco).marca });
                if (identidad(anterior) !== identidad(v)) { valido = false; break; }
                continue;
            }
            h[name] = v;
        }
        if (!valido) continue;
        if (estadoSeparado) {
            const objeto = h.O;
            if (!objeto || Array.isArray(objeto) || !(objeto as Hueco).estado) continue;
            h[estadoSeparado] = (objeto as Hueco).estado!;
        }
        if (!p.restricciones?.(h)) continue;
        if((p.id==='SE1'||p.id==='SE3')&&(h.C1 as Hueco)?.marca!==(h.C2 as Hueco)?.marca)continue;
        if ((p.id === 'D1' || p.id === 'D4') && / es (?:física|sistémica)\.$/.test(texto)) h.C = { ...(h.C as Hueco), genero: 'f' };
        if (p.id.endsWith('-XOR') && (h.operador as Hueco).texto !== 'XOR' || p.id.endsWith('-OR') && (h.operador as Hueco).texto !== 'OR') continue;
        if (p.id === 'RF3b' && / es una /.test(tokens.plano)) h.general = { ...(h.general as Hueco), genero: 'f' };
        const hechos = congelarHecho(p.hacia(h));
        if (!hechos.length) continue;
        let superficie: string | undefined;
        if (parametros.length) {
            // Sólo posiciones reconocidas como cantidad: una palabra igual en prosa
            // conserva su papel y sus límites. Texto, hechos y símbolos siguen intactos.
            let plano = tokens.plano;
            for (const { desde, hasta } of parametros.sort((a, b) => b.desde - a.desde))
                plano = plano.slice(0, desde) + 'cantidad' + plano.slice(hasta);
            superficie = superficieParaLimites(plano.replace(/§(\d+)§/g, (_, n: string) =>
                tokens.spans[Number(n)]!.marca === 'objeto' ? '**N**' : tokens.spans[Number(n)]!.marca === 'proceso' ? '*N*' : '`s`'));
        }
        const r: Reconocimiento = { plantilla: p.id, hechos, ...(superficie ? { superficieLimites: superficie } : {}) };
        // Los literales reservados conservan su prioridad; la ambigüedad nueva
        // se comprueba entre lecturas del residual etiquetado histórico.
        if (p.familia !== 'etiquetada' || marcada) { memoLineas.set(texto,r); return r; }
        const extremos = Object.values(h).flatMap(v => !v ? [] : Array.isArray(v) ? v : [v as Hueco]);
        if (extremos.some(v => (v.marca === 'objeto' || v.marca === 'proceso') && !multiplicidadEnExtremo(v.marca,v.mult))) continue;
        lecturas.set(firma(hechos),r);
    }
    const r = lecturas.size > 1 ? { plantilla: lecturas.values().next().value!.plantilla, hechos: [], ambigua: true as const }
        : lecturas.values().next().value ?? null;
    memoLineas.set(texto,r); return r;
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
            // Los límites leen gramática y tipografía, nunca datos de huecos reconocidos.
            const reconocida = reconocerLinea(s);
            const superficieInicial = superficieParaLimites(s);
            const superficieLimites = reconocida?.superficieLimites ?? superficieInicial;
            const no = [...NO_CANONIZADAS,...NO_SOPORTADAS].find(x => x.patron.test(x.prosaCompuesta ? superficieInicial : superficieLimites) && !(x.enEtiqueta && reconocida?.plantilla === 'SE1L'));
            // Sujetos enumerados del canon no son plural por multiplicidad (B-09).
            const r = !no || no.registro === 'B-09' ? reconocida : null;
            const limite = no && r?.plantilla !== 'AND-agente' && r?.plantilla !== 'AND-instrumento-procesos' ? no : undefined;
            clasificacion=r?.ambigua?{hechos:HECHOS_VACIOS,diagnosticos:[{codigo:'ambiguous-symbol',severidad:'error',linea:0,mensaje:'Etiqueta y cantidad admiten hechos distintos; delimita la etiqueta entre «».'}]}:limite?{hechos:HECHOS_VACIOS,diagnosticos:diag(limite.codigo,'Construcción fuera del subconjunto inverso soportado.',limite.regla).diagnosticos.map(d=>({...d,linea:0}))}:r?{plantilla:r.plantilla,hechos:r.hechos,diagnosticos:[]}:{hechos:HECHOS_VACIOS,diagnosticos:[{codigo:'syntax-error',severidad:'error',linea:0,mensaje:'Forma OPL no reconocida.'}]};
            if(memoClasificacion.size>=2048)memoClasificacion.delete(memoClasificacion.keys().next().value!);
            memoClasificacion.set(s,clasificacion);
        }
        return {...base,...clasificacion,diagnosticos:clasificacion.diagnosticos.length?clasificacion.diagnosticos.map(d=>({...d,linea:numero})):DIAGS_VACIOS};
    });
    if (memoAnalisis.size >= 256) memoAnalisis.delete(memoAnalisis.keys().next().value!);
    for(const l of resultado){if(l.diagnosticos!==DIAGS_VACIOS){for(const d of l.diagnosticos)Object.freeze(d);Object.freeze(l.diagnosticos);}Object.freeze(l);}
    Object.freeze(resultado);memoAnalisis.set(texto, resultado); return resultado;
}
