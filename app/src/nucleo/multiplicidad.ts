/** Sintaxis declarativa de §11. El AST es efímero: no crea entidades ni ejecuta código. */
interface Numero { readonly n: bigint; readonly d: bigint }
interface Expresion { readonly texto: string; readonly valor?: Numero; readonly parametros: readonly string[] }
interface Rango { readonly desde: Expresion; readonly hasta?: Expresion }
interface Restriccion { readonly texto: string; readonly opl: string; readonly parametros: readonly string[] }
interface Lexema { readonly texto: string; readonly nombre?: string; readonly numero?: Numero }
export interface AnotacionMultiplicidad {
    readonly cantidad: string;
    readonly frase: string;
    readonly restricciones: readonly string[];
    readonly restriccionesOpl: readonly string[];
    readonly parametros: readonly string[];
    readonly normalizada: string;
    readonly plural: boolean;
}
const letras = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
const nombreSimple = new RegExp(`^[${letras}][${letras}0-9]*$`);
const nombreCitado = new RegExp(`^[${letras}][${letras}0-9_\\-|&/]*(?: [${letras}0-9_\\-|&/]+)*$`);
const simbolos = new Set(['?', '*', '+', '2..*', 'muchos']);
const unicos = (xs: readonly string[]) => [...new Set(xs)];
function lexemas(s: string): readonly Lexema[] | null {
    const xs: Lexema[] = [];
    let i = 0;
    while (i < s.length) {
        const espacio = /^\s+/.exec(s.slice(i)); if (espacio) { i += espacio[0].length; continue; }
        const citado = /^"([^"\n]+)"/.exec(s.slice(i));
        if (citado) {
            if (!nombreCitado.test(citado[1]!)) return null;
            xs.push({ texto: citado[0], nombre: citado[1]! }); i += citado[0].length; continue;
        }
        const palabra = new RegExp(`^[${letras}][${letras}0-9]*`).exec(s.slice(i));
        if (palabra) { xs.push({ texto: palabra[0], nombre: palabra[0] }); i += palabra[0].length; continue; }
        const numero = /^(?:0|[1-9]\d*)(?:\.\d+)?/.exec(s.slice(i));
        if (numero) {
            const decimales = numero[0].split('.')[1]?.length ?? 0;
            xs.push({ texto: numero[0], numero: { n: BigInt(numero[0].replace('.', '')), d: 10n ** BigInt(decimales) } });
            i += numero[0].length; continue;
        }
        const signo = /^(?:\.\.|<=|>=|!=|<>|[+*/(),;{}=<>-]|[≠≤≥∈−])/.exec(s.slice(i));
        if (!signo) return null;
        const texto = ({ '≠': '!=', '≤': '<=', '≥': '>=', '∈': 'en', '−': '-' } as Record<string, string>)[signo[0]] ?? signo[0];
        xs.push({ texto }); i += signo[0].length;
    }
    return xs;
}
class Lectura {
    private i = 0;
    constructor(private readonly xs: readonly Lexema[], private readonly opl: boolean) {}
    get fin() { return this.i === this.xs.length; }
    get actual() { return this.xs[this.i]; }
    tomar(t: string) { if (this.actual?.texto !== t) return false; this.i++; return true; }
    exigir(t: string) { if (!this.tomar(t)) throw new Error('Sintaxis de cantidad'); }
    expresion(): Expresion {
        let a = this.producto();
        while (this.actual?.texto === '+' || this.actual?.texto === '-') {
            const op = this.xs[this.i++]!.texto, b = this.producto();
            a = { texto: a.texto + op + b.texto, parametros: unicos([...a.parametros, ...b.parametros]),
                ...(a.valor && b.valor ? { valor: { n: a.valor.n * b.valor.d + (op === '+' ? 1n : -1n) * b.valor.n * a.valor.d, d: a.valor.d * b.valor.d } } : {}) };
        }
        return a;
    }
    private producto(): Expresion {
        let a = this.atomo();
        while (this.actual?.texto === '*' || this.actual?.texto === '/') {
            const op = this.xs[this.i++]!.texto, b = this.atomo();
            if (op === '/' && b.valor?.n === 0n) throw new Error('División por cero');
            const valor = a.valor && b.valor ? op === '*'
                ? { n: a.valor.n * b.valor.n, d: a.valor.d * b.valor.d }
                : { n: a.valor.n * b.valor.d, d: a.valor.d * b.valor.n } : undefined;
            a = { texto: a.texto + op + b.texto, parametros: unicos([...a.parametros, ...b.parametros]), ...(valor ? { valor: valor.d < 0n ? { n: -valor.n, d: -valor.d } : valor } : {}) };
        }
        return a;
    }
    private atomo(): Expresion {
        if (this.tomar('(')) { const x = this.expresion(); this.exigir(')'); return { ...x, texto: '(' + x.texto + ')' }; }
        if (this.actual?.texto === '+' || this.actual?.texto === '-') {
            const signo = this.xs[this.i++]!.texto, x = this.atomo();
            return { texto: signo + x.texto, parametros: x.parametros, ...(x.valor ? { valor: { n: signo === '-' ? -x.valor.n : x.valor.n, d: x.valor.d } } : {}) };
        }
        const t = this.xs[this.i++]; if (!t) throw new Error('Falta operando');
        if (t.numero !== undefined) return { texto: t.texto, valor: t.numero, parametros: [] };
        if (t.nombre !== undefined) return { texto: t.texto, parametros: [t.nombre] };
        throw new Error('Operando de cantidad');
    }
    opciones(comprobarConteo = true): readonly Rango[] {
        const opciones: Rango[] = [];
        do {
            const desde = this.expresion(), hasta = this.tomar('..') || this.opl && this.tomar('a') ? this.expresion() : undefined;
            if (comprobarConteo) for (const x of [desde, hasta]) if (x?.valor && (x.valor.n < 0n || x.valor.n % x.valor.d !== 0n)) throw new Error('Conteo no entero o negativo');
            if (desde.valor && hasta?.valor && desde.valor.n * hasta.valor.d > hasta.valor.n * desde.valor.d) throw new Error('Rango invertido');
            opciones.push({ desde, ...(hasta ? { hasta } : {}) });
        } while (this.tomar(',') || this.opl && this.tomar('o'));
        return opciones;
    }
    restriccion(): Restriccion {
        const izquierda = this.expresion(), textos = [izquierda.texto], superficies = [izquierda.texto], nombres = [...izquierda.parametros];
        if (this.tomar('en')) {
            this.exigir('{'); const miembros: Expresion[] = [];
            do { miembros.push(this.expresion()); } while (this.tomar(','));
            this.exigir('}');
            return { texto: izquierda.texto + ' en {' + miembros.map(x => x.texto).join(',') + '}',
                opl: izquierda.texto + ' en {' + miembros.map(x => x.texto).join(', ') + '}', parametros: unicos([...nombres, ...miembros.flatMap(x => x.parametros)]) };
        }
        let relaciones = 0;
        while (['=', '!=', '<>', '<', '>', '<=', '>='].includes(this.actual?.texto ?? '')) {
            const op = this.xs[this.i++]!.texto;
            const opciones = this.opciones(false), derecha = opciones.map(x => x.desde.texto + (x.hasta ? '..' + x.hasta.texto : '')).join(',');
            textos.push(op, derecha); superficies.push(' ' + op + ' ', opciones.map(x => x.desde.texto + (x.hasta ? ' a ' + x.hasta.texto : '')).join(' o '));
            nombres.push(...opciones.flatMap(x => [...x.desde.parametros, ...(x.hasta?.parametros ?? [])])); relaciones++;
        }
        if (!relaciones) throw new Error('Falta operador de restricción');
        return { texto: textos.join(''), opl: superficies.join(''), parametros: unicos(nombres) };
    }
}
function leer(v: string, opl: boolean): AnotacionMultiplicidad | null {
    if (simbolos.has(v)) return { cantidad: v, frase: v, restricciones: [], restriccionesOpl: [], parametros: [], normalizada: v, plural: v !== '?' && v !== '+' };
    // N era cota abierta en estas tres grafías legacy: el límite simbólico se cita.
    if (/^[012]\.\.N$/.test(v)) return null;
    const prefijoEspecial = v.split(';', 1)[0]!.trim();
    const especial = simbolos.has(prefijoEspecial) ? prefijoEspecial : undefined;
    const xs = lexemas(especial ? v.slice(v.indexOf(';')) : v); if (!xs?.length) return null;
    try {
        const p = new Lectura(xs, opl), opciones = especial ? [] : p.opciones(), restricciones: Restriccion[] = [];
        while (p.tomar(';')) restricciones.push(p.restriccion());
        if (!p.fin) return null;
        const cantidad = especial ?? opciones.map(x => x.desde.texto + (x.hasta ? '..' + x.hasta.texto : '')).join(',');
        if (/^[012]\.\.N$/.test(cantidad)) return null;
        return { cantidad, frase: especial ?? opciones.map(x => x.desde.texto + (x.hasta ? ' a ' + x.hasta.texto : '')).join(' o '),
            restricciones: restricciones.map(x => x.texto), restriccionesOpl: restricciones.map(x => x.opl),
            parametros: unicos([...opciones.flatMap(x => [...x.desde.parametros, ...(x.hasta?.parametros ?? [])]), ...restricciones.flatMap(x => x.parametros)]),
            normalizada: cantidad + restricciones.map(x => '; ' + x.texto).join(''),
            plural: especial ? especial !== '?' && especial !== '+' : !opciones.every(x => x.desde.valor !== undefined && x.desde.valor.n === x.desde.valor.d
                && (!x.hasta || x.hasta.valor !== undefined && x.hasta.valor.n === x.hasta.valor.d)) };
    } catch { return null; }
}
export const analizarMultiplicidad = (v: string): AnotacionMultiplicidad | null => leer(v, false);
export const multiplicidadDesdeOpl = (cantidad: string, restricciones = ''): string | null => {
    const q = leer(cantidad + (restricciones ? '; ' + restricciones : ''), true);
    return q?.normalizada ?? null;
};
export const esParametroSimple = (v: string): boolean => nombreSimple.test(v) && v !== 'muchos';
/** Elección estática: no ejecuta restricciones ni bindings. */
export function requierePlural(v?: string): boolean {
    if (v === undefined || v === '1' || v === '?' || v === '+') return false;
    if (simbolos.has(v) || /^(?:0|[2-9]|[1-9]\d+)$/.test(v) || esParametroSimple(v)) return true;
    return analizarMultiplicidad(v)?.plural ?? false;
}
