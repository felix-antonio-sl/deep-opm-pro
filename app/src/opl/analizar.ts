import type { Id, Ref, TipoCosa, Multiplicidad, Control, Esencia, Afiliacion, Designacion, UnidadTiempo, Operador, RelacionIncompleta, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import type { Severidad } from '../nucleo/diagnostico';
import type { Respuesta, Hecho } from '../nucleo/resultado';
// ---------- Salida del analizador (por nombres; no conoce el modelo) ----------
export interface NombreTipado {
    readonly nombre: string;
    readonly nombrePlural?: string;
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
} // estados: ambos extremos en generalización (RFE); sólo el refinador en exhibición (RF5)
 | {
    readonly tipo: 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco';
    readonly origen: ExtremoTexto;
    readonly destino: ExtremoTexto;
    readonly etiqueta?: string;
    readonly inversa?: string;
};
export type HechoTexto = { readonly k: 'plural'; readonly objeto: string; readonly nombre: string } | {
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


import { PLANTILLAS, patronProducto, ETIQUETA_POR_DEFECTO } from './plantillas';
import type { Plantilla, Hueco, Huecos, ValorHueco } from './plantillas';
import { NO_SOPORTADAS, NO_CANONIZADAS } from './no-soportadas';
import { validarEtiqueta, validarNombreCosa } from '../nucleo/lexico';
import { multiplicidadEnExtremo } from '../nucleo/matriz';
import { multiplicidadDesdeOpl, requierePlural } from '../nucleo/multiplicidad';

interface Span { readonly nombrePlural?: string; readonly texto: string; readonly marca: 'objeto' | 'proceso' | 'estado'; }
const atom = '§\\d+§';
// DEC35: «al menos dos» y «dos o más» son 2..*; el entero exacto va desde 2 (B-10 conserva los demás).
// Captura superficial; la sintaxis de la anotación se comprueba en el núcleo.
const cantidadSuperficial = '(?:«[^«»\\n]+»|[^§«»\\n]+?)';
const restriccionSuperficial = '(?:§r\\d+§|[^§\\n]+?)';
const prefijo = '(?:' + cantidadSuperficial + ' )?';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
function literal(s: string,inicial=false): string {
    const letras=(x:string)=>{const re=escape(x);return inicial?re.replace(/\p{L}/gu,c=>c.toLowerCase()===c.toUpperCase()?c:'['+c.toLowerCase()+c.toUpperCase()+']'):re;};
    return s.split(/([\p{L}]+(?:\|[\p{L}]+)+)/u).map(x=>x.includes('|')?'(?:'+x.split('|').map(letras).join('|')+')':x.split(/( y | o )/).map(t=>t===' y '?inicial?' [yeYE] ':' [ye] ':t===' o '?inicial?' [ouOU] ':' [ou] ':letras(t)).join('')).join('');
}
function slot(k: string,inicial=false,listaAnd=false,tagCodicioso=false,pospuestoPrimero=false): string {
    if (k === 'Q' || k === 'Q^') return '(?:[Ee]xactamente uno de|[Aa]l menos uno de)';
    if (k === 'SEC' || k === 'Lo:ramas' || k === 'plural') return '.+?';
    const name = k.replace(/^(Ly|Lo|Lista):/, '');
    const list = name !== k, mult = name.startsWith('m'), estado = name.endsWith('e') && name !== 'e';
    if (name === 't' || name === 't2') return tagCodicioso ? '.+' : '.+?';
    if (['r', 'v', 'esencia', 'afiliacion', 'u', 'n', 'opd', 'padre', 'restriccion'].includes(name)) return '.+?';
    const prefijoInicial=prefijo.replace(/un opcional/g,'[Uu]n opcional').replace(/una opcional/g,'[Uu]na opcional').replace(/al menos/g,'[Aa]l menos').replace('dos o más','[Dd]os o más').replace('opcional '+String.fromCharCode(92)+'(','[Oo]pcional '+String.fromCharCode(92)+'(');
    const cambio = name === 'cambios' || name === 'entradas' || name === 'salidas';
    const nombre = atom + '(?: proceso)?' + (estado ? '(?: en ' + atom + ')?' : '');
    const variantes = [(inicial ? prefijoInicial : prefijo) + nombre, (inicial ? '(?:[Uu]n|[Uu]na) ' : '(?:un|una) ') + nombre + ' opcional', nombre + ' opcionales'];
    if (pospuestoPrimero) variantes.reverse();
    const restricciones = mult || cambio ? '(?:, donde ' + restriccionSuperficial + ')?' : '';
    const item = cambio ? prefijo + atom + '(?: opcional(?:es)?)?' + (name !== 'salidas' ? ' de ' + atom : '') + (name !== 'entradas' ? ' a ' + atom : '')
        : mult ? '(?:' + variantes.join('|') + ')'
            : (name === 'articulos' ? '(?:un|una) ' : '') + nombre;
    const conjuncion = k.startsWith('Ly:') ? '[ye]' : k.startsWith('Lo:') ? '[ou]' : '[yeou]';
    // A.4.3: las listas AND nuevas cierran con una sola conjunción; los spans son opacos.
    const completo = item + restricciones;
    if (list && listaAnd) return completo + '(?:, ' + completo + ')* ' + conjuncion + ' ' + completo;
    return list ? completo + '(?:(?:, | ' + conjuncion + ' )' + completo + ')*' : completo;
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
        const estadosSeparados: readonly { objeto: string; estado: string }[] = [];
        const original = { ...compilar({ ...p, patron },codicioso,pospuesto), p, marcada, estadosSeparados, defaultUniPlural: false,
            concordanciaPlural: patron !== patron.replace(/\b(?:inician|manejan)\b/g, 'inicia').replace('se relacionan con', 'se relaciona con') };
        const pares = [...patron.matchAll(/\{(m(?:O[12]?|C[12]))\} en \{([esab])\}/g)];
        if (!pares.length) return [original];
        const unido = compilar({ ...p, patron: patron.replace(/\{(m(?:O[12]?|C[12]))\} en \{([esab])\}/g, '{$1e}') });
        return [original, { ...unido, p, marcada, defaultUniPlural: false, concordanciaPlural: original.concordanciaPlural, estadosSeparados: pares.map(x => ({ objeto: x[1]!.slice(1), estado: x[2]! })) }];
    };
    if (p.familia !== 'etiquetada') {
        const producto = patronProducto(p);
        const normales = producto === p.patron ? variantes(p.patron, false) : [...variantes(producto, false), ...variantes(p.patron, false)];
        return /^(?:H1|HS1|ET[12]|ETS[1234]|EH[12]|EHS[12])$/.test(p.id)
            ? [...variantes(producto.replace(/\binicia\b/g, 'inician').replace(/\bmaneja\b/g, 'manejan'), false), ...normales] : normales;
    }
    const marcado = patronProducto(p);
    const defaultPlural = ['SE2', 'SE2L', 'SSE1', 'SSE2', 'SSE3'].includes(p.id)
        ? variantes(marcado.replace(/«(?:se relaciona con|\{t\})»/, 'se relacionan con'), true).map(v => ({ ...v, defaultUniPlural: true })) : [];
    return [...defaultPlural, ...variantes(marcado, true), ...variantes(p.patron, false),
        ...variantes(p.patron, false, true), ...variantes(p.patron, false, false, true), ...variantes(p.patron, false, true, true)];
}).sort((a, b) => {
    const residual = (id: string) => /^(?:SE[13]|SE1L|SSE[12345])$/.test(id) ? 1 : 0;
    return residual(a.p.id) - residual(b.p.id) || b.peso - a.peso;
});
function nombres(texto: string): { plano: string; spans: Span[]; restricciones: readonly string[] } | null {
    // Las referencias de restricción son privadas de esta lectura, no sintaxis de entrada.
    if (/§r\d+§/u.test(texto)) return null;
    const spans: Span[] = [], restricciones: string[] = [];
    // La multiplicación dentro del hueco delimitado no es Markdown de proceso.
    const sinEstiloRestriccion = texto.replace(/, \*\*(donde ([^\n]+?))\*\*/gu,
        (original, _frase: string, condicion: string) => multiplicidadDesdeOpl('n', condicion)
            ? ', donde §r' + (restricciones.push(condicion) - 1) + '§' : original);
    let invalido = false;
    const plano = sinEstiloRestriccion.replace(/(«[^«»\n]+»)|\*\*([^*]+)\*\*(?: \[nombre: «([^«»\n]+)»\])?|(?<![\p{L}\d])\*([^*]+)\*(?![\p{L}\d*])|`([^`]+)`/gu,
        (original, citado: string, o: string, canon: string, p: string, e: string) => {
            if (citado) return citado;
            if (e === 'Current') return '`Current`';
            if (canon !== undefined && (validarNombreCosa(canon) || validarNombreCosa(o))) invalido = true;
            // El span es el nombre completo; el sufijo «proceso» (R-OPL-9) sólo se reconoce fuera de él.
            const n = (canon ?? o ?? p ?? e).trim();
            const i = spans.push({ texto: n, marca: o !== undefined ? 'objeto' : p !== undefined ? 'proceso' : 'estado', ...(canon !== undefined ? { nombrePlural: o } : {}) }) - 1;
            return `§${i}§`;
        });
    if (invalido) return null;
    return /`/.test(plano.replace(/«[^«»\n]+»/gu, '').replace('`Current`', '')) ? null : { plano, spans, restricciones };
}
function restriccionOriginal(s: string, restricciones: readonly string[]): string | null {
    const m = /^§r(\d+)§$/u.exec(s);
    return m ? restricciones[Number(m[1])] ?? null : s;
}
function capturar(k: string, s: string, spans: readonly Span[], parametro?: (desde: number, hasta: number) => void, restricciones: readonly string[] = [], contexto?: { ambigua: () => void; andCerrado: boolean }): ValorHueco | null {
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
    if (name === 'restriccion') { const texto = restriccionOriginal(s, restricciones); return texto !== null && multiplicidadDesdeOpl('n', texto) ? { texto } : null; }
    if (name === 'plural') return validarNombreCosa(s) ? null : { texto: s };
    if (name === 'ramas') {
        const ramas: Hueco[] = []; let cursor = 0;
        const re = /§(\d+)§ \[([^\[\]]+)\]/gy;
        while (cursor < s.length) {
            if (ramas.length) { const sep = /^(?:, | [ou] )/.exec(s.slice(cursor)); if (!sep) return null; cursor += sep[0].length; }
            re.lastIndex = cursor; const m = re.exec(s); if (!m) return null; cursor = re.lastIndex;
            const p = spans[Number(m[1])]; if (p?.marca !== 'proceso') return null;
            const texto = m[2]!.replace(/§(\d+)§/g, (_, id: string) => {
                const x = spans[Number(id)]!;
                return x.marca === 'objeto' ? '**' + (x.nombrePlural ?? x.texto) + '**' + (x.nombrePlural ? ` [nombre: «${x.texto}»]` : '') : x.marca === 'proceso' ? '*' + x.texto + '*' : '`' + x.texto + '`';
            }).replace(/, donde §r(\d+)§/gu, (_, id: string) => ', **donde ' + restricciones[Number(id)]! + '**');
            const r = reconocerLinea(texto + '.'); const h = r?.hechos;
            if (!h || h.length !== 1 || h[0]!.k !== 'enlace' || !('objeto' in h[0]!.enlace) || h[0]!.enlace.proceso !== p.texto) return null;
            ramas.push({ ...p, enlaceTexto: h[0]!.enlace });
        }
        return ramas.length >= 2 ? ramas : null;
    }

    if (name !== k && (name.startsWith('m') || ['cambios', 'entradas', 'salidas'].includes(name)) && /, donde (?!§r\d+§)/u.test(s)) {
        // Legacy sólo unívoco: un «o» puede cerrar la restricción o pertenecer
        // a ella. Se comprueban secuencias completas, nunca el modelo existente.
        type Lectura = { valores: Hueco[]; parametros: { desde: number; hasta: number }[] };
        const conjuncion = k.startsWith('Ly:') ? '[ye]' : k.startsWith('Lo:') ? '[ou]' : '[yeou]';
        const separador = new RegExp('^(?:, | ' + conjuncion + ' )');
        const cierres = [...s.matchAll(new RegExp('(?=$|(?:, | ' + conjuncion + ' )' + prefijo + '§\\d+§)', 'gu'))].map(x => x.index!);
        const memo = new Map<string, readonly Lectura[]>();
        const leer = (desde: number, finalAnd: boolean): readonly Lectura[] => {
            const clave = desde + ':' + finalAnd, previa = memo.get(clave); if (previa) return previa;
            const lecturas = new Map<string, Lectura>();
            for (const fin of cierres) {
                if (fin <= desde) continue;
                const posiciones: Lectura['parametros'] = [];
                const v = capturar(name, s.slice(desde, fin), spans,
                    (a, b) => posiciones.push({ desde: desde + a, hasta: desde + b }), restricciones);
                const miembro = v ? Array.isArray(v) ? v : [v as Hueco] : [];
                if (miembro.length !== 1) continue;
                let colas: readonly Lectura[];
                if (fin === s.length) {
                    if (contexto?.andCerrado && !finalAnd) continue;
                    colas = [{ valores: [], parametros: [] }];
                } else {
                    if (finalAnd) continue;
                    const sep = separador.exec(s.slice(fin)); if (!sep) continue;
                    colas = leer(fin + sep[0].length, !!contexto?.andCerrado && sep[0] !== ', ');
                }
                for (const cola of colas) {
                    const lectura = { valores: [...miembro, ...cola.valores], parametros: [...posiciones, ...cola.parametros] };
                    lecturas.set(JSON.stringify(lectura.valores), lectura);
                    if (lecturas.size === 2) break;
                }
                if (lecturas.size === 2) break;
            }
            const resultado = [...lecturas.values()]; memo.set(clave, resultado); return resultado;
        };
        const lecturas = leer(0, false), unica = lecturas[0]; if (!unica) return null;
        if (lecturas.length > 1) contexto?.ambigua();
        for (const posicion of unica.parametros) parametro?.(posicion.desde, posicion.hasta);
        return unica.valores;
    }
    if (name === 'cambios' || name === 'entradas' || name === 'salidas') {
        const limite = '(?=$|(?:, | [yeou] )' + prefijo + '§\\d+§)';
        const re = new RegExp('((?:' + cantidadSuperficial + ' )?§(\\d+)§(?: opcional(?:es)?)?)'
            + (name !== 'salidas' ? ' de §(\\d+)§' : '') + (name !== 'entradas' ? ' a §(\\d+)§' : '')
            + '(?:, donde (' + restriccionSuperficial + '))?' + limite, 'dgy');
        const valores: Hueco[] = [];
        let cursor = 0;
        while (cursor < s.length) {
            if (valores.length) {
                const separador = /^(?:, | [yeou] )/.exec(s.slice(cursor)); if (!separador) return null;
                cursor += separador[0].length;
            }
            re.lastIndex = cursor; const m = re.exec(s); if (!m) return null; cursor = re.lastIndex;
            const posicionRestriccion = name === 'cambios' ? 5 : 4, restriccion = m[posicionRestriccion];
            const cantidad = capturar('mO', m[1]! + (restriccion ? ', donde ' + restriccion : ''), spans, undefined, restricciones);
            if (!cantidad || Array.isArray(cantidad)) return null;
            const objeto = cantidad as Hueco, entrada = name !== 'salidas' ? spans[Number(m[3])] : undefined;
            const salida = name !== 'entradas' ? spans[Number(m[name === 'salidas' ? 3 : 4])] : undefined;
            if (objeto.marca !== 'objeto' || entrada && entrada.marca !== 'estado' || salida && salida.marca !== 'estado') return null;
            if (objeto.mult && m.indices?.[1]) parametro?.(m.indices[1][0], m.indices[1][1]);
            if (objeto.mult && m.indices?.[posicionRestriccion]) parametro?.(m.indices[posicionRestriccion]![0] - ', donde '.length, m.indices[posicionRestriccion]![1]);
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
    const limite = '(?=$|(?:, | [yeou] )' + prefijo + '§\\d+§)';
    const cuerpoCantidad = '(?:(' + cantidadSuperficial + ') )?§(\\d+)§(?: proceso)?(?: en §(\\d+)§)?(?: (opcionales|opcional))?(?:, donde (' + restriccionSuperficial + '))?';
    const cantidad = new RegExp(cuerpoCantidad + limite, 'diy');
    let cursor = 0;
    while (cursor < s.length) {
        if (valores.length) {
            const separador = /^(?:, | [yeou] )/.exec(s.slice(cursor));
            if (!separador) return null;
            cursor += separador[0].length;
        }
        cantidad.lastIndex = cursor;
        let m = cantidad.exec(s); if (!m) return null;
        if (m[5] !== undefined && !multiplicidadDesdeOpl('n', restriccionOriginal(m[5], restricciones) ?? '')) {
            // Un separador superficial dentro de un parámetro citado o conjunto
            // no cierra la restricción. El núcleo decide su sintaxis completa;
            // se prueban sólo los cierres posteriores ante otro miembro o el fin.
            for (const fin of s.matchAll(new RegExp(limite, 'gu'))) {
                if (fin.index! <= cantidad.lastIndex) continue;
                const alternativa = new RegExp(cuerpoCantidad + '(?=[\\s\\S]{' + (s.length - fin.index!) + '}$)', 'diy');
                alternativa.lastIndex = cursor;
                const a = alternativa.exec(s);
                if (a?.[5] !== undefined && multiplicidadDesdeOpl('n', restriccionOriginal(a[5], restricciones) ?? '')) { m = a; break; }
            }
        }
        cursor = m.indices![0]![1];
        const modificador = m[1]?.toLowerCase();
        const delimitado = m[1]?.startsWith('«') ? m[1].slice(1, -1) : undefined;
        const span = spans[Number(m[2])]!, e = m[3] ? spans[Number(m[3])] : undefined;
        const esperado = ['s','e','a','b'].includes(name) ? 'estado' : /^(?:O|Olista)/.test(base) ? 'objeto' : /^(?:P|Plista)/.test(base) ? 'proceso' : undefined;
        if (esperado && span.marca !== esperado || e && e.marca !== 'estado') return null;
        const pospuesto = m[4]?.toLowerCase();
        if (pospuesto === 'opcional' && !['un', 'una'].includes(modificador ?? '') || pospuesto === 'opcionales' && modificador) return null;
        if (delimitado === undefined && /^(?:Infinity|NaN)$/i.test(m[1] ?? '')) return null;
        if (delimitado !== undefined && ['?', '*', '+', '2..*', 'muchos'].includes(delimitado)) return null;
        let mult: Multiplicidad | undefined = delimitado !== undefined ? multiplicidadDesdeOpl(delimitado) ?? undefined
            : pospuesto === 'opcional' ? '?' : pospuesto === 'opcionales' ? '*' : !modificador ? undefined
                : modificador === 'opcional (cero o más)' ? '*' : ['un opcional', 'una opcional'].includes(modificador) ? '?'
            : modificador === 'al menos dos' || modificador === 'dos o más' ? '2..*' : ['al menos un', 'al menos una'].includes(modificador) ? '+'
                : ['muchos','muchas'].includes(modificador) ? 'muchos' : ['un','una'].includes(modificador) ? '1' : multiplicidadDesdeOpl(m[1]!) ?? undefined;
        if (m[5] !== undefined) {
            // Sin una cantidad propia, «donde» sigue siendo una restricción de
            // colección B54; no se inventa una cantidad para alojarla.
            if (mult === undefined) return null;
            const condicion = restriccionOriginal(m[5], restricciones); if (condicion === null) return null;
            mult = multiplicidadDesdeOpl(delimitado ?? mult, condicion) ?? undefined;
            if (mult === undefined) return null;
        }
        if (name.startsWith('m') && modificador && mult === undefined) return null;
        if (span.nombrePlural && (!name.startsWith('m') || !requierePlural(mult))) return null;
        if (mult && m.indices?.[1]) parametro?.(m.indices[1][0], m.indices[1][1]);
        if (mult && m.indices?.[5]) parametro?.(m.indices[5][0] - ', donde '.length, m.indices[5][1]);
        valores.push({ ...span, ...(/(?:^| )una(?: |$)|^muchas$/.test(modificador ?? '') ? { genero: 'f' as const } : {}), ...(mult ? { mult } : {}), ...(e ? { estado: e } : {}) });
    }
    if (!valores.length) return null;
    return name !== k ? valores : valores.length === 1 ? valores[0]! : null;
}
function congelarHecho<T>(x:T):T {
    if(x&&typeof x==='object'&&!Object.isFrozen(x)){for(const v of Object.values(x))congelarHecho(v);Object.freeze(x);}return x;
}
type Reconocimiento = { plantilla: string; hechos: readonly HechoTexto[]; ambigua?: true; ambiguaCantidad?: true; superficieLimites?: string };
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
    for (const { p, re, keys, estadosSeparados, marcada, concordanciaPlural, defaultUniPlural } of esqueletos) {
        const match = re.exec(tokens.plano); if (!match) continue;
        const h: Record<string, ValorHueco> = {}; let valido = true, cantidadAmbigua = false;
        const parametros: { desde: number; hasta: number }[] = [];
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]!, s = match[i + 1]; if (s === undefined) continue;
            const inicio = match.indices![i + 1]![0];
            const v = capturar(k, s, tokens.spans, (desde, hasta) => parametros.push({ desde: inicio + desde, hasta: inicio + hasta }), tokens.restricciones,
                { ambigua: () => { cantidadAmbigua = true; }, andCerrado: p.id.startsWith('AND-') || p.id === 'SE1L' || p.id === 'SE2L' });
            if (!v) { valido = false; break; }
            let name = k === 'Q' || k === 'Q^' ? 'operador' : k.replace(/^(Ly|Lo|Lista):/, '');
            if (name.startsWith('m')) name = name.slice(1).replace(/^(O[12]?|Olista|C[12])e$/, '$1');
            if (h[name]) {
                const anterior = h[name]!;
                const identidad = (x: ValorHueco) => Array.isArray(x) ? JSON.stringify(x) : JSON.stringify({ texto: (x as Hueco).texto, marca: (x as Hueco).marca });
                if (identidad(anterior) !== identidad(v)) { valido = false; break; }
                continue;
            }
            h[name] = v;
        }
        if (!valido) continue;
        for (const par of estadosSeparados) {
            const objeto = h[par.objeto];
            if (!objeto || Array.isArray(objeto) || !(objeto as Hueco).estado) { valido = false; break; }
            const estado = (objeto as Hueco).estado!, anterior = h[par.estado];
            if (anterior && (Array.isArray(anterior) || (anterior as Hueco).texto !== estado.texto || (anterior as Hueco).marca !== estado.marca)) { valido = false; break; }
            h[par.estado] = estado;
        }
        if (!valido) continue;
        if (h.restriccion) {
            const objeto = h.O as Hueco | undefined;
            const mult = objeto?.mult ? multiplicidadDesdeOpl(objeto.mult, (h.restriccion as Hueco).texto) : null;
            if (!objeto || !mult) continue;
            h.O = { ...objeto, mult };
            const desde = match.indices![keys.indexOf('restriccion') + 1]!;
            parametros.push({ desde: desde[0] - ', donde '.length, hasta: desde[1] });
        }
        if (defaultUniPlural || /^(?:H1|HS1|ET[12]|ETS[1234]|EH[12]|EHS[12]|SE2|SE2L)$/.test(p.id)) {
            const sujeto = (h.O ?? h.C1 ?? h.O1) as Hueco | undefined;
            if (concordanciaPlural !== (!!sujeto?.nombrePlural && requierePlural(sujeto.mult))) continue;
        }
        // DEC57: el literal nulo plural exige la misma firma/huecos UNI,
        // pero no reconstruye una etiqueta libre desde el verbo reservado.
        if (defaultUniPlural) { h.t = { texto: ETIQUETA_POR_DEFECTO }; h.defaultUni = h.t; }
        if (!p.restricciones?.(h)) continue;
        if((p.id==='SE1'||p.id==='SE3')&&(h.C1 as Hueco)?.marca!==(h.C2 as Hueco)?.marca)continue;
        if ((p.id === 'D1' || p.id === 'D4') && / es (?:física|sistémica)\.$/.test(texto)) h.C = { ...(h.C as Hueco), genero: 'f' };
        if (p.id.endsWith('-XOR') && (h.operador as Hueco).texto !== 'XOR' || p.id.endsWith('-OR') && (h.operador as Hueco).texto !== 'OR') continue;
        if (p.id === 'RF3b' && / es una /.test(tokens.plano)) h.general = { ...(h.general as Hueco), genero: 'f' };
        const hechos = congelarHecho(p.hacia(h));
        if (!hechos.length) continue;
        if (cantidadAmbigua) {
            const r: Reconocimiento = { plantilla: p.id, hechos: [], ambigua: true, ambiguaCantidad: true };
            memoLineas.set(texto, r); return r;
        }
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
        const normal = /[“”‘’≤≥≠∈]/u.test(original) ? original.replace(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)|[“”‘’≤≥≠∈]/gu,(x,span)=>span??({'“':'"','”':'"','‘':"'",'’':"'",'≤':'<=','≥':'>=','≠':'!=','∈':'en'} as Record<string,string>)[x]!) : original;
        const s = normal.replace(/[\t\u00a0]+/g, ' ').replace(/ +/g, ' ').trim().replace(/^(?:[-•] |\d+[.)] )/, ''), numero = i + 1;
        const base = { numero, texto: s, vacia: !s, hechos: HECHOS_VACIOS, diagnosticos: DIAGS_VACIOS };
        if (!s || /^# /.test(s)) return base;
        const cab = /^## (SD(?:[1-9]\d*(?:\.[1-9]\d*)*)?)(?: .*)?$/.exec(s);
        if (cab) return { ...base, cabecera: cab[1]! };
        const diag = (codigo: CodigoOpl, mensaje: string, regla?: string): LineaAnalizada => ({ ...base, diagnosticos: [{ codigo, severidad: codigo === 'unsupported-canonical' ? 'warning' : 'error', linea: numero, mensaje, ...(regla ? { regla } : {}) }] });
        if (/§r\d+§/u.test(s)) return diag('syntax-error', 'Forma OPL no reconocida.');
        if (!s.endsWith('.') && !/\. \[etiqueta: [^\]]+\]$/.test(s)) return diag('syntax-error', 'La oración OPL-ES debe terminar en punto.');
        let clasificacion=memoClasificacion.get(s);
        if(!clasificacion){
            // Los límites leen gramática y tipografía, nunca datos de huecos reconocidos.
            const reconocida = reconocerLinea(s);
            const superficieInicial = superficieParaLimites(s);
            const superficieLimites = reconocida?.superficieLimites ?? superficieInicial;
            const no = [...NO_CANONIZADAS,...NO_SOPORTADAS].find(x => x.patron.test(x.prosaCompuesta ? superficieInicial : superficieLimites) && !(x.enEtiqueta && reconocida?.plantilla === 'SE1L'));
            // Sujetos enumerados del canon no son plural por multiplicidad (B-09).
            const r = reconocida?.ambiguaCantidad || !no || no.registro === 'B-09' ? reconocida : null;
            const limite = no && r?.plantilla !== 'AND-agente' && r?.plantilla !== 'AND-instrumento-procesos' && !(no.registro === 'B-09' && r?.hechos.some(h => h.k === 'enlace' && 'objeto' in h.enlace && !!h.enlace.objeto.nombrePlural || h.k === 'abanico' && h.ramas.some(e => 'objeto' in e && !!e.objeto.nombrePlural))) ? no : undefined;
            clasificacion=r?.ambigua?{hechos:HECHOS_VACIOS,diagnosticos:[{codigo:'ambiguous-symbol',severidad:'error',linea:0,mensaje:'La oración admite hechos distintos; conserva las delimitaciones de etiqueta, cantidad y restricción.'}]}:limite?{hechos:HECHOS_VACIOS,diagnosticos:diag(limite.codigo,limite.mensaje??'Construcción fuera del subconjunto inverso soportado.',limite.regla).diagnosticos.map(d=>({...d,linea:0}))}:r?{plantilla:r.plantilla,hechos:r.hechos,diagnosticos:[]}:{hechos:HECHOS_VACIOS,diagnosticos:[{codigo:'syntax-error',severidad:'error',linea:0,mensaje:'Forma OPL no reconocida.'}]};
            if(memoClasificacion.size>=2048)memoClasificacion.delete(memoClasificacion.keys().next().value!);
            memoClasificacion.set(s,clasificacion);
        }
        return {...base,...clasificacion,diagnosticos:clasificacion.diagnosticos.length?clasificacion.diagnosticos.map(d=>({...d,linea:numero})):DIAGS_VACIOS};
    });
    if (memoAnalisis.size >= 256) memoAnalisis.delete(memoAnalisis.keys().next().value!);
    for(const l of resultado){if(l.diagnosticos!==DIAGS_VACIOS){for(const d of l.diagnosticos)Object.freeze(d);Object.freeze(l.diagnosticos);}Object.freeze(l);}
    Object.freeze(resultado);memoAnalisis.set(texto, resultado); return resultado;
}
