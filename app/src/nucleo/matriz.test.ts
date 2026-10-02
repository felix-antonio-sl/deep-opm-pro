import { afterEach, expect, test } from 'bun:test';
import * as matriz from './matriz';
import type { DatosEtiquetas } from './matriz';
import { MATRIZ, REGLAS_CONTEXTO, NO_OFRECIDO, noOfrecido, noOfrecidoDescomposicion, violacionesForma, violacionesContexto, violacionesAbanico, tiposLegales, erroresContexto } from './matriz';
import { EXPECTATIVAS_MATRIZ, EXPECTATIVAS_REGLAS } from '../pruebas/expectativas-matriz';
import { modeloCon, congelar } from '../pruebas/constructores';
import { azar } from '../pruebas/azar';
import { validarForma } from './forma';
import { transaccion } from './resultado';
import type { Modelo, Enlace, EnlaceNuevo, TipoEnlace, Objeto, Abanico } from './tipos';
const validos: Modelo[] = [];
const base = () => { const m = modeloCon({ objetos: [['A', ['inicio', 'fin']], ['B', ['activo', 'inactivo']], ['C', []]], procesos: ['Hacer', 'Usar', 'Acabar'] }); validos.push(m); return m; };
const ids = (m: Modelo) => Object.values(m.cosas).map(c => c.id);
function poner(m: Modelo, ...es: Enlace[]): Modelo { return congelar({ ...m, enlaces: Object.fromEntries(es.map(e => [e.id, e])), secuencia: 200 }); }
function sano(m: Modelo): Modelo { validos.push(m); return m; }
function refinar(m: Modelo, bandas: readonly (readonly string[])[] = [[ids(m)[4]!], [ids(m)[5]!]]): Modelo {
    const p = ids(m)[3]!, internos = bandas.flat(), root = m.opds[m.raiz]!;
    return congelar({ ...m, secuencia: 200, opds: { [m.raiz]: { ...root, apariciones: Object.fromEntries(Object.entries(root.apariciones).filter(([id]) => !internos.includes(id))) }, 'opd-100': { id: 'opd-100', tipo: 'descomposicion', padre: m.raiz, cosa: p, orden: 0, bandas, objetosInternos: [], apariciones: root.apariciones } } });
}
function enlace(m: Modelo, tipo: TipoEnlace, id = 'e-101'): Enlace {
    const [a, b, , p, q] = ids(m);
    switch (tipo) {
        case 'consumo':
        case 'resultado':
        case 'efecto':
        case 'agente':
        case 'instrumento': return { id, tipo, objeto: a!, proceso: p! };
        case 'agregacion':
        case 'exhibicion':
        case 'generalizacion':
        case 'clasificacion': return { id, tipo, refinable: a!, refinador: b! };
        case 'etiquetadoBidireccional': return { id, tipo, origen: a!, destino: b!, etiqueta: 'conoce', inversa: 'es-conocido' };
        case 'invocacion':
        case 'excepcionSobretiempo':
        case 'excepcionSubtiempo': return { id, tipo, origen: p!, destino: q! };
        default: return { id, tipo, origen: a!, destino: b! };
    }
}
const reglas = (m: Modelo, e: Enlace) => violacionesContexto(m, e).map(v => v.regla);
const objeto = (m: Modelo, i = 0) => m.cosas[ids(m)[i]!] as Objeto;
const s = (m: Modelo, i = 0, j = 0) => objeto(m, i).estados[j]!.id;
const opciones = (m: Modelo, desde: string, hacia: string, estadoDesde?: string, estadoHacia?: string, opd = m.raiz, etiquetas?: DatosEtiquetas) => tiposLegales(m, { opd, desde: { cosa: desde, ...(estadoDesde ? { estado: estadoDesde } : {}) }, hacia: { cosa: hacia, ...(estadoHacia ? { estado: estadoHacia } : {}) }, ...(etiquetas ? { etiquetas } : {}) });
afterEach(() => {
    for (const m of validos.splice(0)) {
        expect(Object.isFrozen(m)).toBe(true);
        expect(validarForma(m)).toEqual([]);
    }
});
for (const tipo of Object.keys(EXPECTATIVAS_MATRIZ) as TipoEnlace[]) {
    test(`T-040 ${tipo}: tabla independiente y firmas legal/ilegal`, () => {
        const { plantillas, menu, ...fila } = MATRIZ[tipo];
        expect(fila).toEqual(EXPECTATIVAS_MATRIZ[tipo]);
        expect(menu).toBeGreaterThan(0);
        expect(plantillas.length).toBeGreaterThan(0);
        const m = base(), e = enlace(m, tipo);
        expect(violacionesForma(m, e)).toEqual([]);
        sano(poner(m, e));
        const malo: Enlace = 'objeto' in e ? { ...e, objeto: ids(m)[3]! } : 'refinable' in e ? { ...e, refinador: e.refinable } : { ...e, origen: ids(m)[2]!, destino: ids(m)[3]! };
        expect(violacionesForma(m, malo).length).toBeGreaterThan(0);
    });
}
test('T-040 reglas independientes presentes y acciones reparables tipadas', () => {
    for (const r of EXPECTATIVAS_REGLAS) {
        if (r.id.startsWith('R-FAN'))
            continue;
        expect(REGLAS_CONTEXTO.some(x => x.id === r.id && r.tipos.every(t => x.tipos.includes(t)))).toBe(true);
    }
    const m = base();
    const r = REGLAS_CONTEXTO.find(x => x.id === 'R-DIST-1')!;
    expect(r.reparacion?.(enlace(m, 'consumo'))).toEqual({ op: 'distribuirEnlace', args: { enlace: 'e-101' } });
});
test('T-041 estados se validan por dueño y pares de generalización', () => {
    const m = base();
    expect(violacionesForma(m, { ...enlace(m, 'consumo'), tipo: 'consumo', objeto: ids(m)[0]!, proceso: ids(m)[3]!, estado: s(m) })).toEqual([]);
    expect(violacionesForma(m, { tipo: 'consumo', objeto: ids(m)[0]!, proceso: ids(m)[3]!, estado: s(m, 1) }).length).toBeGreaterThan(0);
    expect(violacionesForma(m, { tipo: 'generalizacion', refinable: ids(m)[0]!, refinador: ids(m)[1]!, estados: { general: s(m), especializacion: s(m, 1) } })).toEqual([]);
});
test('T-042 menú respeta dirección canónica y consumo/resultado', () => {
    const m = base(), [a, , , p] = ids(m);
    const o = opciones(m, a!, p!);
    expect(o.find(x => x.tipo === 'consumo' && x.sentido === 'directo')?.legal).toBe(true);
    expect(o.find(x => x.tipo === 'resultado' && x.sentido === 'inverso')?.legal).toBe(true);
    const legales = o.filter(x => x.legal === true);
    expect(legales.map(x => MATRIZ[x.tipo].menu)).toEqual(legales.map(x => MATRIZ[x.tipo].menu).sort((a, b) => a - b));
});
test('T-043 resultado admite objeto/no inicial y rechaza inicial', () => {
    const m = base(), a = objeto(m);
    const inicial = congelar({ ...m, cosas: { ...m.cosas, [a.id]: { ...a, estados: a.estados.map((x, i) => i === 0 ? { ...x, inicial: true as const } : x) } } });
    sano(inicial);
    const e: Enlace = { tipo: 'resultado', id: 'e-101', objeto: a.id, proceso: ids(m)[3]!, estado: s(m) };
    expect(reglas(inicial, e)).toContain('R-RES-1');
    expect(reglas(inicial, { ...e, estado: s(m, 0, 1) })).not.toContain('R-RES-1');
    expect(opciones(inicial, ids(m)[3]!, a.id, undefined, s(m)).find(x => x.tipo === 'resultado' && x.sentido === 'directo')?.legal).toBe(false);
});
test('T-044 efecto exige estados y consulta herencia múltiple transitiva sin materializar', () => {
    const m = base(), [a, b, c, p] = ids(m);
    const e: Enlace = { tipo: 'efecto', id: 'e-103', objeto: c!, proceso: p! };
    expect(reglas(m, e)).toContain('R-EFE-1');
    const h = sano(poner(m, { tipo: 'generalizacion', id: 'e-101', refinable: a!, refinador: b! }, { tipo: 'generalizacion', id: 'e-102', refinable: b!, refinador: c! }));
    expect(reglas(h, e)).not.toContain('R-EFE-1');
    expect(objeto(h, 2).estados).toEqual([]);
});
test('T-045 agente físico legal; informacional requiere instrumento', () => {
    const m = base(), a = objeto(m), e = enlace(m, 'agente');
    expect(reglas(m, e)).not.toContain('R-AG-1');
    const n = sano(congelar({ ...m, cosas: { ...m.cosas, [a.id]: { ...a, esencia: 'informacional' as const } } }));
    expect(reglas(n, e)).toContain('R-AG-1');
    expect(reglas(n, enlace(n, 'instrumento'))).toEqual([]);
});
test('T-046 autoinvocación legal y objeto ilegal', () => { const m = base(), p = ids(m)[3]!; expect(violacionesForma(m, { tipo: 'invocacion', origen: p, destino: p })).toEqual([]); expect(violacionesForma(m, { tipo: 'invocacion', origen: ids(m)[0]!, destino: p }).length).toBeGreaterThan(0); });
test('T-047 ambas excepciones se integran con forma real y no inventan cotas', () => {
    const m = base();
    for (const t of ['excepcionSobretiempo', 'excepcionSubtiempo'] as const) {
        const e = enlace(m, t);
        expect(violacionesContexto(m, e)).toEqual([]);
        sano(poner(m, e));
    }
    expect(m.cosas[ids(m)[3]!]).not.toHaveProperty('duracion');
});
test('T-048 exhibición permite cuatro firmas; restantes exigen mismo tipo', () => {
    const m = base();
    for (const a of [ids(m)[0]!, ids(m)[3]!])
        for (const b of [ids(m)[1]!, ids(m)[4]!])
            expect(violacionesForma(m, { tipo: 'exhibicion', refinable: a, refinador: b })).toEqual([]);
    expect(violacionesForma(m, { tipo: 'agregacion', refinable: ids(m)[0]!, refinador: ids(m)[3]! }).length).toBeGreaterThan(0);
});
test('T-049 etiquetado admite relación unaria y rechaza obj-proceso', () => { const m = base(), a = ids(m)[0]!; expect(violacionesForma(m, { tipo: 'etiquetado', origen: a, destino: a })).toEqual([]); expect(violacionesForma(m, { tipo: 'etiquetado', origen: a, destino: ids(m)[3]! }).length).toBeGreaterThan(0); });
test('T-050 gesto con estado solo destino no ofrece bi ni recíproco', () => {
    const m = base();
    for (const tipo of ['reciproco', 'etiquetadoBidireccional'])
        expect(opciones(m, ids(m)[0]!, ids(m)[1]!, undefined, s(m, 1)).find(x => x.tipo === tipo && x.sentido === 'directo')?.legal).toBe(false);
    expect(opciones(m, ids(m)[0]!, ids(m)[1]!, s(m), undefined).find(x => x.tipo === 'etiquetadoBidireccional' && x.sentido === 'directo')?.legal).toBe('pendiente');
});
test('T-051 escisión no admite control pero TS4 standalone sí', () => { const m = base(), e: EnlaceNuevo = { tipo: 'efecto', objeto: ids(m)[0]!, proceso: ids(m)[3]!, entrada: s(m), control: 'e' }; expect(violacionesForma(m, e)).toEqual([]); expect(violacionesForma(m, { ...e, escision: { par: 'e-102', mitad: 'entrada' } }).length).toBeGreaterThan(0); });
test('T-052 control escalar inválido se rechaza sin interpretar c+e', () => { const m = base(); const e = { tipo: 'consumo' as const, objeto: ids(m)[0]!, proceso: ids(m)[3]!, control: 'ce' }; expect(violacionesForma(m, e as unknown as EnlaceNuevo).length).toBeGreaterThan(0); });
test('T-053 segundo transformador y habilitador bloqueados; mismo abanico exime', () => { const m = base(), e = enlace(m, 'consumo'), r = enlace(m, 'resultado', 'e-102'); const n = sano(poner(m, e)); expect(reglas(n, r)).toContain('R-ROL-UNIC-1'); const f: Abanico = { id: 'f-110', operador: 'XOR', enlaces: ['e-101', 'e-102'] }; const e2: Enlace = { id: 'e-102', tipo: 'consumo', objeto: ids(m)[0]!, proceso: ids(m)[3]!, estado: s(m) }; const fan = sano(congelar({ ...poner(m, e, e2), abanicos: { [f.id]: f } })); expect(reglas(fan, e2)).not.toContain('R-ROL-UNIC-1'); expect(reglas(n, enlace(m, 'instrumento', 'e-103'))).toContain('R-ROL-UNIC-1'); });
test('T-053 unicidad entre ancestro y descendiente y no entre hermanos', () => { const m = sano(refinar(base())), [a, , , p, q, r] = ids(m); const n = sano(poner(m, { tipo: 'instrumento', id: 'e-101', objeto: a!, proceso: p! })); expect(reglas(n, { tipo: 'efecto', id: 'e-102', objeto: a!, proceso: q! })).toContain('R-ROL-UNIC-1'); const h = sano(poner(m, { tipo: 'instrumento', id: 'e-101', objeto: a!, proceso: q! })); expect(reglas(h, { tipo: 'instrumento', id: 'e-102', objeto: a!, proceso: r! })).not.toContain('R-ROL-UNIC-1'); });
function fan(m: Modelo, tipo: 'consumo' | 'resultado' | 'efecto' | 'agente' | 'instrumento' | 'invocacion', comun: 'objeto' | 'proceso' = 'proceso', control?: 'c' | 'e'): Modelo { const [a, b, , p, q] = ids(m); const es: Enlace[] = tipo === 'invocacion' ? [{ tipo, id: 'e-101', origen: p!, destino: q! }, { tipo, id: 'e-102', origen: p!, destino: ids(m)[5]! }] : [{ tipo, id: 'e-101', objeto: a!, proceso: p!, ...(control ? { control } : {}) }, { tipo, id: 'e-102', objeto: comun === 'objeto' ? a! : b!, proceso: comun === 'proceso' ? p! : q!, ...(control ? { control } : {}) }]; return congelar({ ...poner(m, ...es), abanicos: { 'f-110': { id: 'f-110', operador: 'XOR', enlaces: ['e-101', 'e-102'] } } }); }
test('T-054 seis tipos convergentes/divergentes y rechazo de geometría/tipos', () => {
    const m = base();
    for (const t of ['consumo', 'resultado', 'efecto', 'agente', 'instrumento', 'invocacion'] as const)
        for (const c of ['objeto', 'proceso'] as const) {
            const n = sano(fan(m, t, c));
            expect(violacionesAbanico(n, n.abanicos['f-110']!)).toEqual([]);
        }
    const n = fan(m, 'consumo');
    expect(violacionesAbanico(n, { id: 'f-111', operador: 'OR', enlaces: ['e-101', 'e-101'] }).length).toBeGreaterThan(0);
    expect(violacionesAbanico(poner(m, enlace(m, 'consumo'), enlace(m, 'instrumento', 'e-102')), { id: 'f-110', operador: 'OR', enlaces: ['e-101', 'e-102'] }).length).toBeGreaterThan(0);
});
test('T-055 controles en resultado/invocación no son firma legal', () => {
    const m = base();
    for (const t of ['resultado', 'invocacion'] as const)
        expect(violacionesForma(m, { ...enlace(m, t), control: 'c' } as unknown as Enlace).length).toBeGreaterThan(0);
});
test('T-056 control mixto inválido y homogéneo sin plantilla no ofrecido', () => { const m = base(), n = fan(m, 'instrumento', 'proceso', 'c'), f = n.abanicos['f-110']!; expect(violacionesAbanico(n, f)).toEqual([]); expect(noOfrecido(n, n.enlaces['e-101']!, f)?.id).toBe('nf-abanico-control'); const mix: Modelo = congelar({ ...n, enlaces: { ...n.enlaces, 'e-102': { tipo: 'instrumento' as const, id: 'e-102', objeto: ids(m)[1]!, proceso: ids(m)[3]! } } }); expect(violacionesAbanico(mix, f).map(v => v.regla)).toContain('R-FAN-3'); expect(noOfrecido(mix, mix.enlaces['e-101']!, f)).toBeNull(); });
test('T-056 tres controles con plantilla y alternativas sin plantilla', () => {
    const m = base();
    for (const [t, c, k] of [['consumo', 'proceso', 'c'], ['efecto', 'objeto', 'c'], ['efecto', 'objeto', 'e']] as const) {
        const n = sano(fan(m, t, c, k));
        expect(noOfrecido(n, n.enlaces['e-101']!, n.abanicos['f-110']!)).toBeNull();
    }
    for (const t of ['agente', 'instrumento', 'consumo'] as const) {
        const n = fan(m, t, 'objeto', 'e');
        expect(noOfrecido(n, n.enlaces['e-101']!, n.abanicos['f-110']!)?.registro).toBe('B-08');
    }
});
test('T-057 multiplicidad con c, TS y SSE no ofrecida; mult ordinaria legal', () => {
    const m = base(), a = ids(m)[0]!, p = ids(m)[3]!;
    for (const e of [{ tipo: 'consumo', objeto: a, proceso: p, mult: '+', control: 'c' }, { tipo: 'efecto', objeto: a, proceso: p, mult: '+', entrada: s(m) }, { tipo: 'etiquetado', origen: a, destino: ids(m)[1]!, multDestino: '+', estadoOrigen: s(m) }] as const)
        expect(noOfrecido(m, e)?.registro).toBe('B-04');
    expect(noOfrecido(m, { tipo: 'consumo', objeto: a, proceso: p, mult: '+', control: 'e' })).toBeNull();
});
test('T-058 ruta solo consumo/resultado y no vacía', () => { const m = base(); expect(violacionesForma(m, { tipo: 'consumo', objeto: ids(m)[0]!, proceso: ids(m)[3]!, ruta: 'L' })).toEqual([]); expect(violacionesForma(m, { tipo: 'consumo', objeto: ids(m)[0]!, proceso: ids(m)[3]!, ruta: '' }).length).toBeGreaterThan(0); expect(violacionesForma(m, { ...enlace(m, 'instrumento'), ruta: 'L' } as unknown as Enlace).length).toBeGreaterThan(0); });
test('T-059 estado no puede anclarse a proceso', () => { const m = base(); expect(opciones(m, ids(m)[3]!, ids(m)[4]!, s(m)).some(o => o.legal === true)).toBe(false); });
test('T-060 contorno consumo/resultado y evento sistémico bloqueados; ambiental habilitador legal', () => {
    const m = sano(refinar(base()));
    for (const t of ['consumo', 'resultado'] as const)
        expect(reglas(m, enlace(m, t))).toContain('R-DIST-1');
    const e: Enlace = { tipo: 'instrumento', id: 'e-101', objeto: ids(m)[0]!, proceso: ids(m)[3]!, control: 'e' };
    expect(reglas(m, e)).toContain('R-CX-DIST-2');
    const a = objeto(m), n = sano(congelar({ ...m, cosas: { ...m.cosas, [a.id]: { ...a, afiliacion: 'ambiental' as const } } }));
    expect(reglas(n, e)).not.toContain('R-CX-DIST-2');
    expect(reglas(m, { ...e, control: 'c' })).not.toContain('R-CX-DIST-2');
});
test('T-060 AP-07 TS3 bloqueado con dos bandas, TS4 y una banda legales', () => { const m = sano(refinar(base())), e: Enlace = { tipo: 'efecto', id: 'e-101', objeto: ids(m)[0]!, proceso: ids(m)[3]!, entrada: s(m), salida: s(m, 0, 1) }; expect(reglas(m, e)).toContain('AP-07'); expect(reglas(m, { tipo: 'efecto', id: e.id, objeto: e.objeto, proceso: e.proceso, entrada: e.entrada! })).not.toContain('AP-07'); expect(reglas(sano(refinar(base(), [[ids(m)[4]!]])), e)).not.toContain('AP-07'); });
test('T-061 AP-27 error con previo obligatorio y warning si todos omisibles', () => { const m = sano(refinar(base())), [a, b, , , q, r] = ids(m), e: Enlace = { tipo: 'instrumento', id: 'e-102', objeto: b!, proceso: r!, control: 'e' }; const previo: Enlace = { tipo: 'consumo', id: 'e-101', objeto: a!, proceso: q! }; const n = sano(poner(m, previo)); expect(reglas(n, e)).toContain('AP-27'); expect(erroresContexto(poner(n, previo, e)).map(v => v.regla)).toContain('AP-27'); const c: Enlace = { ...previo, control: 'c' }, omisible = sano(poner(m, c)); expect(reglas(omisible, e)).toContain('AP-27'); expect(erroresContexto(sano(poner(m, c, e))).map(v => v.regla)).not.toContain('AP-27'); expect(reglas(m, { ...e, proceso: q! })).not.toContain('AP-27'); });
test('T-046 doble vara adyacente bloqueada; bucle y salto legales', () => { const m = sano(refinar(base())), q = ids(m)[4]!, r = ids(m)[5]!, e: Enlace = { tipo: 'invocacion', id: 'e-101', origen: q, destino: r }; expect(reglas(m, e)).toContain('R-INV-2B'); expect(reglas(m, { ...e, origen: r, destino: q })).not.toContain('R-INV-2B'); expect(reglas(m, { ...e, destino: q })).not.toContain('R-INV-2B'); });
test('T-064 DS20 rollback, error previo tolerado y excepción explícita con matriz real', () => {
    const m = base(), a = objeto(m), e = enlace(m, 'agente');
    const n = sano(poner(m, e));
    const snap = JSON.stringify(n);
    const editar = (tx: Parameters<typeof transaccion>[1] extends (tx: infer T) => void ? T : never) => tx.poner('cosas', { ...a, esencia: 'informacional' });
    expect(transaccion(n, editar).ok).toBe(false);
    expect(JSON.stringify(n)).toBe(snap);
    const admitido = transaccion(n, editar, { permiteErroresNuevos: true });
    expect(admitido.ok).toBe(true);
    if (admitido.ok) {
        const previo = sano(congelar(admitido.valor.modelo));
        expect(transaccion(previo, tx => tx.modelo({ nombre: 'Otro' })).ok).toBe(true);
        const cambio = transaccion(previo, tx => { tx.quitar('enlaces', e.id); tx.poner('enlaces', { ...e, id: 'e-102' }); });
        expect(cambio.ok).toBe(false);
    }
});
test('T-066 internos solo enlazan cosas visibles en dueño; extremos visibles exigidos', () => { const m = sano(refinar(base())), a = ids(m)[0]!, q = ids(m)[4]!; expect(opciones(m, a, q).some(x => x.legal === true)).toBe(false); expect(opciones(m, a, q, undefined, undefined, 'opd-100').some(x => x.legal === true)).toBe(true); const hijo = m.opds['opd-100']!, sin = sano(congelar({ ...m, opds: { ...m.opds, 'opd-100': { ...hijo, apariciones: Object.fromEntries(Object.entries(hijo.apariciones).filter(([id]) => id !== a)) } } })); expect(opciones(sin, q, a, undefined, undefined, 'opd-100').some(x => x.legal === true)).toBe(false); });
test('T-053 segundo gesto propone completarCambio, abanicoCon o cambiarTipoExistente', () => {
    const m = base(), a = ids(m)[0]!, p = ids(m)[3]!, ts4: Enlace = { tipo: 'efecto', id: 'e-101', objeto: a, proceso: p, entrada: s(m) };
    const n = sano(poner(m, ts4));
    const op = opciones(n, p, a, undefined, s(m, 0, 1)).find(x => x.tipo === 'efecto' && x.sentido === 'directo');
    expect(op?.legal).toBe(false);
    if (op && op.legal === false)
        expect(op.alternativa).toEqual({ k: 'completarCambio', enlace: 'e-101', estados: { entrada: s(m), salida: s(m, 0, 1) } });
    const c = sano(poner(m, { tipo: 'consumo', id: 'e-101', objeto: a, proceso: p, estado: s(m) }));
    const fanop = opciones(c, a, p, s(m, 0, 1)).find(x => x.tipo === 'consumo' && x.sentido === 'directo');
    if (fanop && fanop.legal === false)
        expect(fanop.alternativa?.k).toBe('abanicoCon');
    else
        throw Error('segundo gesto debe bloquear');
    const cambio = opciones(c, a, p).find(x => x.tipo === 'agente' && x.sentido === 'directo');
    if (cambio && cambio.legal === false)
        expect(cambio.alternativa?.k).toBe('cambiarTipoExistente');
    else
        throw Error('debe bloquear');
});
test('T-050 recíproco estados sin etiqueta no ofrecido; etiquetado legal', () => { const m = base(), a = ids(m)[0]!, b = ids(m)[1]!; expect(noOfrecido(m, { tipo: 'reciproco', origen: a!, destino: b!, estados: { origen: s(m) } })?.registro).toBe('B-05'); expect(noOfrecido(m, { tipo: 'reciproco', origen: a!, destino: b!, etiqueta: 'conoce', estados: { origen: s(m) } })).toBeNull(); expect(opciones(m, a, b, s(m)).find(x => x.tipo === 'reciproco' && x.sentido === 'directo')?.legal).toBe('pendiente'); });
test('T-054 efecto estados admite entrada/salida común pero no ambas variables ni mixto', () => { const m = base(), a = ids(m)[0]!, p = ids(m)[3]!, q = ids(m)[4]!, f: Abanico = { id: 'f-110', operador: 'XOR', enlaces: ['e-101', 'e-102'] }; const e: Enlace = { tipo: 'efecto', id: 'e-101', objeto: a, proceso: p, entrada: s(m), salida: s(m, 0, 1) }; const n = poner(m, e, { ...e, id: 'e-102', salida: s(m) }); expect(noOfrecido(n, e, f)).toBeNull(); const mixto = poner(m, e, { tipo: 'efecto', id: 'e-102', objeto: a, proceso: q }); expect(noOfrecido(mixto, e, f)?.registro).toBe('B-06'); });
test('T-040 F2/F5 reales y 200 semillas sin mocks', () => {
    for (let i = 0; i < 200; i++)
        sano(azar(i));
    const m = base(), e = enlace(m, 'invocacion');
    expect(validarForma(poner(m, { ...e, tipo: 'invocacion', origen: ids(m)[0]!, destino: ids(m)[3]! })).map(v => v.codigo)).toContain('F-2');
    expect(validarForma(poner(m, { tipo: 'consumo', id: 'e-101', objeto: ids(m)[0]!, proceso: ids(m)[3]!, mult: '+', control: 'c' })).map(v => v.codigo)).toContain('F-5');
    const n = fan(m, 'instrumento', 'proceso', 'c');
    expect(validarForma(n).map(v => v.codigo)).toContain('F-5');
    expect(NO_OFRECIDO.map(x => x.registro).sort()).toEqual(['B-02', 'B-04', 'B-05', 'B-06', 'B-08']);
});
test('T-268 manejador sistémico legal, diagnóstico posterior advertirá', () => { const m = base(), e = enlace(m, 'excepcionSobretiempo'); expect(violacionesForma(m, e)).toEqual([]); expect(violacionesContexto(m, e)).toEqual([]); expect(opciones(m, ids(m)[3]!, ids(m)[4]!).find(x => x.tipo === 'excepcionSobretiempo' && x.sentido === 'directo')?.legal).toBe(true); });
test('T-072 descomposición de objeto no ofrecida como consulta sin enlace artificial', () => { const m = base(); expect(noOfrecidoDescomposicion(m, ids(m)[0]!)?.registro).toBe('B-02'); expect(noOfrecidoDescomposicion(m, ids(m)[3]!)).toBeNull(); });
test('T-054 ramas distintas semánticamente y ausencia de común se rechazan', () => { const m = base(), e: Enlace = { tipo: 'consumo', id: 'e-101', objeto: ids(m)[0]!, proceso: ids(m)[3]! }, f: Abanico = { id: 'f-110', operador: 'OR', enlaces: ['e-101', 'e-102'] }; expect(violacionesAbanico(poner(m, e, { ...e, id: 'e-102' }), f).length).toBeGreaterThan(0); expect(violacionesAbanico(poner(m, e, { ...e, id: 'e-102', objeto: ids(m)[1]!, proceso: ids(m)[4]! }), f).length).toBeGreaterThan(0); });
test('T-041 import con campos de estado ajenos a la fila se rechaza', () => {
    const m = base();
    for (const e of [{ ...enlace(m, 'agregacion'), estado: s(m) }, { ...enlace(m, 'invocacion'), estadoOrigen: s(m) }, { ...enlace(m, 'etiquetadoBidireccional'), estadoDestino: s(m, 1) }])
        expect(violacionesForma(m, e as unknown as Enlace).length).toBeGreaterThan(0);
});
test('T-057 valores de multiplicidad inválidos en etiquetados se rechazan', () => { const m = base(); expect(violacionesForma(m, { tipo: 'etiquetado', origen: ids(m)[0]!, destino: ids(m)[1]!, multOrigen: '2' } as unknown as EnlaceNuevo).length).toBeGreaterThan(0); });
test('T-054 FAN5 estados entrada común, salida común y prohibición ambas variables', () => { const m = base(), a = ids(m)[0]!, p = ids(m)[3]!, f: Abanico = { id: 'f-110', operador: 'XOR', enlaces: ['e-101', 'e-102'] }, e: Enlace = { tipo: 'efecto', id: 'e-101', objeto: a, proceso: p, entrada: s(m), salida: s(m, 0, 1) }; let n = poner(m, e, { ...e, id: 'e-102', entrada: s(m, 0, 1) }); expect(noOfrecido(n, e, f)).toBeNull(); n = poner(m, e, { ...e, id: 'e-102', entrada: s(m, 0, 1), salida: s(m) }); expect(noOfrecido(n, e, f)?.registro).toBe('B-06'); });
test('T-044 herencia múltiple con ciclos termina y conserva estados propios', () => { const m = base(), [a, b, c, p] = ids(m), n = sano(poner(m, { tipo: 'generalizacion', id: 'e-101', refinable: a!, refinador: c! }, { tipo: 'generalizacion', id: 'e-102', refinable: b!, refinador: c! }, { tipo: 'generalizacion', id: 'e-103', refinable: c!, refinador: b! })); expect(reglas(n, { tipo: 'efecto', id: 'e-104', objeto: c!, proceso: p! })).not.toContain('R-EFE-1'); expect(objeto(n, 2).estados).toEqual([]); });
test('T-064 DS20 identidad codigo+refs tolera cambiar regla con mismas referencias', () => {
    const m = base(), a = objeto(m, 2), n = sano(poner(congelar({ ...m, cosas: { ...m.cosas, [a.id]: { ...a, esencia: 'informacional' as const } } }), { tipo: 'agente', id: 'e-101', objeto: a.id, proceso: ids(m)[3]! }));
    expect(erroresContexto(n).map(v => v.regla)).toEqual(['R-AG-1']);
    const r = transaccion(n, tx => tx.poner('enlaces', { tipo: 'efecto', id: 'e-101', objeto: a.id, proceso: ids(m)[3]! }));
    expect(r.ok).toBe(true);
    if (r.ok) {
        const nuevo = sano(congelar(r.valor.modelo));
        expect(erroresContexto(nuevo).map(v => v.regla)).toEqual(['R-EFE-1']);
    }
});
test('T-063 cambio de tipo reevalúa firma de enlaces incidentes', () => { const m = base(), a = objeto(m), e = enlace(m, 'consumo'), n = congelar({ ...m, cosas: { ...m.cosas, [a.id]: { id: a.id, tipo: 'proceso' as const, nombre: a.nombre, esencia: a.esencia, afiliacion: a.afiliacion } } }); expect(violacionesForma(m, e)).toEqual([]); expect(violacionesForma(n, e).length).toBeGreaterThan(0); });
test('T-053 no propone abanicoCon que colisione con un abanico existente', () => {
    const m = base(), a = ids(m)[0]!, p = ids(m)[3]!, e: Enlace = { tipo: 'consumo', id: 'e-101', objeto: a, proceso: p, estado: s(m) }, n = sano(congelar({ ...poner(m, e, { tipo: 'consumo', id: 'e-102', objeto: ids(m)[1]!, proceso: p }), abanicos: { 'f-110': { id: 'f-110', operador: 'XOR', enlaces: ['e-101', 'e-102'] } } }));
    const o = opciones(n, a, p, s(m, 0, 1)).find(x => x.tipo === 'consumo' && x.sentido === 'directo');
    expect(o?.legal).toBe(false);
    if (o && o.legal === false)
        expect(o.alternativa?.k).toBe('cambiarTipoExistente');
});
test('T-041 anclaje vacío y especialización incompleta se rechazan', () => { const m = base(); expect(violacionesForma(m, { tipo: 'consumo', objeto: ids(m)[0]!, proceso: ids(m)[3]!, estado: '' }).length).toBeGreaterThan(0); expect(violacionesForma(m, { tipo: 'generalizacion', refinable: ids(m)[0]!, refinador: ids(m)[1]!, estados: { general: s(m) } } as unknown as EnlaceNuevo).length).toBeGreaterThan(0); });

for (const sentido of ['directo', 'inverso'] as const) {
    test(`T-040 T-120 bidireccional ${sentido}: pendiente sin candidato y completación conserva F-11`, () => {
        const m = base(), snap = JSON.stringify(m), [a, b] = ids(m);
        const pendiente = opciones(m, a!, b!).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === sentido);
        expect(pendiente?.legal).toBe('pendiente');
        expect(pendiente).toHaveProperty('requiere', ['etiqueta', 'inversa']);
        expect(pendiente).not.toHaveProperty('candidato');
        expect(pendiente).not.toHaveProperty('id');
        const completa = opciones(m, a!, b!, undefined, undefined, m.raiz, { etiqueta: 'conoce', inversa: 'es-conocido' }).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === sentido);
        expect(completa?.legal).toBe(true);
        if (!completa || completa.legal !== true) throw Error('completación requerida');
        expect(completa.candidato).toEqual({ tipo: 'etiquetadoBidireccional', origen: sentido === 'directo' ? a! : b!, destino: sentido === 'directo' ? b! : a!, etiqueta: 'conoce', inversa: 'es-conocido' });
        const incorporado = poner(m, { ...completa.candidato, id: 'e-101' });
        expect(Object.isFrozen(incorporado)).toBe(true);
        expect(validarForma(incorporado)).toEqual([]);
        expect(JSON.stringify(m)).toBe(snap);
    });
    test(`T-050 recíproco ${sentido}: B-05 real, datos pendientes y completos con ambos estados`, () => {
        const m = base(), [a, b] = ids(m), snap = JSON.stringify(m);
        const args = { opd: m.raiz, desde: { cosa: a!, estado: s(m) }, hacia: { cosa: b!, estado: s(m, 1) } };
        const pendiente = tiposLegales(m, args).find(o => o.tipo === 'reciproco' && o.sentido === sentido);
        expect(pendiente?.legal).toBe('pendiente');
        expect(pendiente).toHaveProperty('requiere', ['etiqueta']);
        expect(pendiente).not.toHaveProperty('candidato');
        for (const etiqueta of [null, '', ' ', 'Conoce', ' conoce', 'conoce  mucho', 'conoce.']) {
            const invalid = tiposLegales(m, { ...args, etiquetas: { etiqueta } }).find(o => o.tipo === 'reciproco' && o.sentido === sentido);
            expect(invalid?.legal).toBe(false);
            expect(invalid).not.toHaveProperty('candidato');
        }
        const completa = tiposLegales(m, { ...args, etiquetas: { etiqueta: 'conoce' } }).find(o => o.tipo === 'reciproco' && o.sentido === sentido);
        expect(completa?.legal).toBe(true);
        if (!completa || completa.legal !== true || completa.candidato.tipo !== 'reciproco') throw Error('recíproco completo');
        expect(completa.candidato.estados).toEqual(sentido === 'directo' ? { origen: s(m), destino: s(m, 1) } : { origen: s(m, 1), destino: s(m) });
        expect(noOfrecido(m, completa.candidato)).toBeNull();
        const { etiqueta, ...sinEtiqueta } = completa.candidato;
        expect(noOfrecido(m, sinEtiqueta)?.registro).toBe('B-05');
        expect(validarForma(poner(m, { ...completa.candidato, id: 'e-101' }))).toEqual([]);
        expect(JSON.stringify(m)).toBe(snap);
    });
    test(`T-120 bidireccional ${sentido}: igualdad evalúa recíproco efectivo, intención completa y traza pura`, () => {
        const m = base(), [a, b] = ids(m);
        const desde = sentido === 'directo' ? { cosa: a!, estado: s(m) } : { cosa: b! };
        const hacia = sentido === 'directo' ? { cosa: b! } : { cosa: a!, estado: s(m) };
        const datos = congelar({ etiqueta: 'conoce', inversa: 'conoce' });
        const completa = tiposLegales(m, { opd: m.raiz, desde, hacia, etiquetas: datos }).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === sentido);
        expect(completa?.legal).toBe(true);
        if (!completa || completa.legal !== true) throw Error('igualdad válida');
        expect(completa.candidato).toHaveProperty('tipo', 'etiquetadoBidireccional');
        expect(completa.candidato).toHaveProperty('inversa', 'conoce');
        const entrada = congelar(completa.candidato), snap = JSON.stringify(entrada);
        expect(typeof matriz.normalizarEtiquetas).toBe('function');
        const normal = matriz.normalizarEtiquetas(entrada);
        expect(normal.ok).toBe(true);
        if (!normal.ok || normal.valor.tipo !== 'reciproco') throw Error('normalización real');
        expect(normal.valor).toEqual({ tipo: 'reciproco', origen: a!, destino: b!, etiqueta: 'conoce', estados: { origen: s(m) } });
        expect(normal.trazas).toEqual([{ regla: 'R-STRE-1', mensaje: expect.stringContaining('conoce'), refs: [] }]);
        expect(validarForma(poner(m, { ...normal.valor, id: 'e-101' }))).toEqual([]);
        expect(JSON.stringify(entrada)).toBe(snap);
        expect(datos).toEqual({ etiqueta: 'conoce', inversa: 'conoce' });
        const previo = sano(poner(m, { ...normal.valor, id: 'e-101' }));
        const duplicado = tiposLegales(previo, { opd: m.raiz, desde, hacia, etiquetas: datos }).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === sentido);
        expect(duplicado?.legal).toBe(false);
        if (duplicado?.legal === false) expect(duplicado.motivo.codigo).toBe('ya-existe');
    });
}
test('T-120 datos bidireccionales parciales pendientes, explícitos inválidos rechazados y sin persistencia', () => {
    const m = base(), [a, b] = ids(m), snap = JSON.stringify(m);
    for (const datos of [{}, { etiqueta: 'conoce' }, { inversa: 'es-conocido' }, { etiqueta: undefined, inversa: undefined } as unknown as DatosEtiquetas]) {
        const o = opciones(m, a!, b!, undefined, undefined, m.raiz, datos).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === 'directo');
        expect(o?.legal).toBe('pendiente');
        expect(o).not.toHaveProperty('candidato');
    }
    for (const campo of ['etiqueta', 'inversa'] as const)
        for (const dato of [null, '', ' ', 'Conoce', ' conoce', 'conoce  mucho', 'conoce.']) {
            const datos = { etiqueta: 'conoce', inversa: 'es-conocido', [campo]: dato };
            for (const sentido of ['directo', 'inverso'] as const) {
                const o = opciones(m, a!, b!, undefined, undefined, m.raiz, datos).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === sentido);
                expect(o?.legal).toBe(false);
                expect(o).not.toHaveProperty('candidato');
            }
        }
    expect(JSON.stringify(m)).toBe(snap);
    expect(validarForma(poner(m, { tipo: 'etiquetadoBidireccional', id: 'e-101', origen: a!, destino: b!, etiqueta: '', inversa: '' })).map(v => v.codigo)).toContain('F-11');
});
test('T-040 firma, anclajes y visibilidad inválidos rechazan antes de solicitar etiquetas', () => {
    const m = base(), [a, b, , p] = ids(m);
    for (const o of opciones(m, a!, p!).filter(o => ['etiquetadoBidireccional', 'reciproco'].includes(o.tipo))) expect(o.legal).toBe(false);
    for (const o of opciones(m, a!, a!, s(m)).filter(o => ['etiquetadoBidireccional', 'reciproco'].includes(o.tipo))) expect(o.legal).toBe(false);
    const invisible = congelar({ ...m, opds: { [m.raiz]: { ...m.opds[m.raiz]!, apariciones: {} } } });
    for (const o of opciones(invisible, a!, b!, s(m)).filter(o => ['etiquetadoBidireccional', 'reciproco'].includes(o.tipo))) {
        expect(o.legal).toBe(false);
        if (o.legal === false && o.sentido === 'directo') expect(o.motivo.codigo).toBe('no-visible');
    }
    expect(opciones(m, a!, b!, undefined, s(m, 1)).find(o => o.tipo === 'etiquetadoBidireccional' && o.sentido === 'directo')?.legal).toBe(false);
});
test('T-049 T-120 etiquetas opcionales ausentes/null se omiten, léxico explícito se valida y menú discrimina tres estados', () => {
    const m = base(), [a, b] = ids(m);
    for (const datos of [undefined, {}, { etiqueta: null }, { etiqueta: undefined } as unknown as DatosEtiquetas])
        for (const tipo of ['etiquetado', 'reciproco']) {
            const o = opciones(m, a!, b!, undefined, undefined, m.raiz, datos).find(o => o.tipo === tipo && o.sentido === 'directo');
            expect(o?.legal).toBe(true);
            if (o?.legal === true) expect(o.candidato).not.toHaveProperty('etiqueta');
        }
    for (const dato of ['', ' ', 'Conoce', ' conoce'])
        for (const tipo of ['etiquetado', 'reciproco']) expect(opciones(m, a!, b!, undefined, undefined, m.raiz, { etiqueta: dato }).find(o => o.tipo === tipo && o.sentido === 'directo')?.legal).toBe(false);
    const os = opciones(m, a!, b!), rango = (o: (typeof os)[number]) => o.legal === true ? 0 : o.legal === 'pendiente' ? 1 : 2;
    expect(os.some(o => o.legal === true)).toBe(true);
    expect(os.some(o => o.legal === 'pendiente')).toBe(true);
    expect(os.some(o => o.legal === false)).toBe(true);
    expect(os.map(rango)).toEqual(os.map(rango).sort((a, b) => a - b));
});
test('T-120 normalizador conserva multiplicidades y datos, rechaza vacíos y no inventa trazas', () => {
    const m = base(), [a, b] = ids(m);
    expect(typeof matriz.normalizarEtiquetas).toBe('function');
    const e: EnlaceNuevo = congelar({ tipo: 'etiquetadoBidireccional', origen: a!, destino: b!, etiqueta: 'conoce', inversa: 'conoce', multOrigen: '+', multDestino: '?' });
    const snap = JSON.stringify(e), r = matriz.normalizarEtiquetas(e);
    expect(r.ok).toBe(true);
    if (r.ok) {
        expect(r.valor).toEqual({ tipo: 'reciproco', origen: a!, destino: b!, etiqueta: 'conoce', multOrigen: '+', multDestino: '?' });
        expect(r.trazas.map(t => t.regla)).toEqual(['R-STRE-1']);
        expect(validarForma(poner(m, { ...r.valor, id: 'e-101' }))).toEqual([]);
    }
    expect(JSON.stringify(e)).toBe(snap);
    for (const dato of ['', ' ', 'Conoce', ' conoce']) expect(matriz.normalizarEtiquetas({ ...e, etiqueta: dato, inversa: dato }).ok).toBe(false);
    const distinto: EnlaceNuevo = { ...e, inversa: 'es-conocido' };
    expect(matriz.normalizarEtiquetas(distinto)).toEqual({ ok: true, valor: distinto, trazas: [] });
    const consumo: EnlaceNuevo = { tipo: 'consumo', objeto: a!, proceso: ids(m)[3]! };
    expect(matriz.normalizarEtiquetas(consumo)).toEqual({ ok: true, valor: consumo, trazas: [] });
});
for (const inverso of [false, true]) test(`T-040 generalización de estados duplicada, orden anidado ${inverso}`, () => {
    const m = base(), [a, b] = ids(m), general = s(m), especializacion = s(m, 1);
    const e: Enlace = { tipo: 'generalizacion', id: 'e-101', refinable: a!, refinador: b!, estados: inverso ? { especializacion, general } : { general, especializacion } };
    const n = sano(poner(m, e)), o = opciones(n, a!, b!, general, especializacion).find(o => o.tipo === 'generalizacion' && o.sentido === 'directo');
    expect(o?.legal).toBe(false);
    if (o?.legal === false) expect(o.motivo.codigo).toBe('ya-existe');
});
test('T-053 alternativas limitadas al mismo par, colisiones de ancestro/descendiente conservan rechazo', () => {
    const m = sano(refinar(base())), [a, , , p, q] = ids(m);
    for (const [existente, destino] of [[p!, q!], [q!, p!]]) {
        const n = sano(poner(m, { tipo: 'instrumento', id: 'e-101', objeto: a!, proceso: existente! }));
        const o = opciones(n, a!, destino!, undefined, undefined, 'opd-100').find(o => o.tipo === 'agente' && o.sentido === 'directo');
        expect(o?.legal).toBe(false);
        if (o?.legal === false) expect(o.motivo.regla).toBe('R-ROL-UNIC-1');
        expect(o).not.toHaveProperty('alternativa');
        const mismoPar = opciones(n, a!, existente!, undefined, undefined, 'opd-100').find(o => o.tipo === 'agente' && o.sentido === 'directo');
        expect(mismoPar?.legal).toBe(false);
        if (mismoPar?.legal === false) expect(mismoPar.alternativa).toEqual({ k: 'cambiarTipoExistente', enlace: 'e-101' });
    }
});
