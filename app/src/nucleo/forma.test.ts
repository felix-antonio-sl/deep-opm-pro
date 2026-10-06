import { test, expect, mock, afterEach } from 'bun:test';
import type { Modelo, Cosa, Enlace, Opd, TipoEnlace, Abanico } from './tipos';
import { modeloCon, porNombre, congelar } from '../pruebas/constructores';
import { EXPECTATIVAS_MATRIZ } from '../pruebas/expectativas-matriz';
const aislado = process.env.OPFORJA_WP1_AISLADO === 'forma';
function caso(nombre: string, cuerpo: () => void): void {
    test(nombre, aislado ? cuerpo : () => {
        const filtro = '^' + nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$';
        const p = Bun.spawnSync([process.execPath, '--no-env-file', 'test', import.meta.path, '-t', filtro], { env: { ...process.env, OPFORJA_WP1_AISLADO: 'forma' } });
        expect(p.exitCode, new TextDecoder().decode(p.stdout) + new TextDecoder().decode(p.stderr)).toBe(0);
    });
}
const matriz = Object.fromEntries(Object.entries(EXPECTATIVAS_MATRIZ).map(([tipo, e]) => [tipo, { ...e, roles: ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'].includes(tipo) ? ['objeto', 'proceso'] : ['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'].includes(tipo) ? ['refinable', 'refinador'] : ['origen', 'destino'] }]));
if (aislado)
    mock.module('./matriz', () => ({ MATRIZ: matriz, noOfrecido: (_m: Modelo, e: Enlace, _f?: Abanico) => e.tipo === 'etiquetado' && (e.etiqueta === 'prohibido' || e.etiqueta === 'solo-abanico' && _f !== undefined) ? { id: 'doble-prueba', regla: 'producto', motivo: 'Prueba independiente', registro: 'B-1' } : null }));
const { validarForma } = await import('./forma');
const { azar } = await import('../pruebas/azar');
let buenos: Modelo[] = [];
afterEach(() => {
    for (const m of buenos)
        expect(validarForma(m)).toEqual([]);
    buenos = [];
});
const base = () => modeloCon({ objetos: [['Alfa', ['uno', 'dos']], ['Beta', ['tres']]], procesos: ['Gamma', 'Delta'] });
const modificar = (m: Modelo, col: 'cosas' | 'enlaces' | 'opds', id: string, v: Cosa | Enlace | Opd) => congelar({ ...m, [col]: { ...m[col], [id]: v } });
const verificar = (codigo: string, m: Modelo) => expect(validarForma(m).map(v => v.codigo)).toContain(codigo);
caso('T-022 T-041 F-1 referencias y F-3 pertenencia de estados', () => { const m = base(), o = porNombre(m, 'Alfa'), p = porNombre(m, 'Gamma'), b = porNombre(m, 'Beta'); const e: Enlace = { id: 'e-100', tipo: 'consumo', objeto: o.id, proceso: p.id, estado: b.tipo === 'objeto' ? b.estados[0]!.id : '' }; verificar('F-3', modificar({ ...m, secuencia: 101 }, 'enlaces', e.id, e)); verificar('F-1', modificar({ ...m, secuencia: 101 }, 'enlaces', e.id, { ...e, objeto: 'ausente' })); });
caso('T-040 F-2 clases, mismo tipo y reflexividad consultan la matriz', () => {
    const m = base(), o = porNombre(m, 'Alfa'), p = porNombre(m, 'Gamma');
    for (const e of [{ id: 'e-100', tipo: 'consumo' as const, objeto: p.id, proceso: o.id }, { id: 'e-100', tipo: 'agregacion' as const, refinable: o.id, refinador: p.id }, { id: 'e-100', tipo: 'excepcionSobretiempo' as const, origen: p.id, destino: p.id }])
        verificar('F-2', modificar({ ...m, secuencia: 101 }, 'enlaces', e.id, e));
});
caso('T-032 F-4 escisión bilateral, misma cosa y mitades sin control', () => { const m = base(), o = porNombre(m, 'Alfa'), p = porNombre(m, 'Gamma'); const s = o.tipo === 'objeto' ? o.estados[0]!.id : ''; const e: Enlace = { id: 'e-100', tipo: 'efecto', objeto: o.id, proceso: p.id, entrada: s, escision: { par: 'e-101', mitad: 'entrada' } }; verificar('F-4', modificar({ ...m, secuencia: 102 }, 'enlaces', e.id, e)); });
caso('T-040 F-5 consulta noOfrecido para cada enlace', () => { const m = base(), a = porNombre(m, 'Alfa'), b = porNombre(m, 'Beta'); const e: Enlace = { id: 'e-100', tipo: 'etiquetado', origen: a.id, destino: b.id, etiqueta: 'prohibido' }; verificar('F-5', modificar({ ...m, secuencia: 101 }, 'enlaces', e.id, e)); });
caso('T-028 F-6 ramas mínimas, distintas y exclusivas', () => { const m = base(); verificar('F-6', { ...m, secuencia: 101, abanicos: { 'f-100': { id: 'f-100', operador: 'OR', enlaces: [] } } }); });
caso('T-031 F-7 raíz designada y única', () => { const m = base(); verificar('F-7', { ...m, raiz: 'ausente' }); verificar('F-7', modificar({ ...m, secuencia: 101 }, 'opds', 'opd-100', { id: 'opd-100', tipo: 'raiz', apariciones: {} })); });
caso('T-030 F-8 bandas, internos y alcance', () => { const m = base(), p = porNombre(m, 'Gamma'); verificar('F-8', modificar({ ...m, secuencia: 101 }, 'opds', 'opd-100', { id: 'opd-100', tipo: 'descomposicion', padre: m.raiz, cosa: p.id, orden: 0, bandas: [[]], objetosInternos: [], apariciones: { [p.id]: m.opds[m.raiz]!.apariciones[p.id]! } })); });
caso('T-022 F-9 ids únicos, claves y secuencia', () => { const m = base(); verificar('F-9', { ...m, secuencia: 1 }); const o = porNombre(m, 'Alfa'); verificar('F-9', modificar(m, 'cosas', o.id, { ...o, id: 'otro' })); });
caso('T-021 F-10 duración finita positiva y ordenada', () => {
    const m = base(), p = porNombre(m, 'Gamma');
    if (p.tipo !== 'proceso')
        throw Error();
    for (const duracion of [{ min: 0 }, { min: Infinity }, { min: 3, max: 2 }, { min: 3, esperada: 2 }, { esperada: 3, max: 2 }])
        verificar('F-10', modificar(m, 'cosas', p.id, { ...p, duracion }));
});
caso('T-026 F-11 etiquetas bidireccionales distintas y no vacías', () => { const m = base(), a = porNombre(m, 'Alfa'), b = porNombre(m, 'Beta'); verificar('F-11', modificar({ ...m, secuencia: 101 }, 'enlaces', 'e-100', { id: 'e-100', tipo: 'etiquetadoBidireccional', origen: a.id, destino: b.id, etiqueta: 'igual', inversa: 'igual' })); });
caso('T-064 F-12 coordenadas y tamaños enteros finitos', () => { const m = base(), o = m.opds[m.raiz]!; const id = porNombre(m, 'Alfa').id; verificar('F-12', modificar(m, 'opds', o.id, { ...o, apariciones: { ...o.apariciones, [id]: { x: NaN, y: 0, ancho: 19, alto: 60 } } })); });
caso('T-020 F-13 valor solo en un rasgo exhibido', () => {
    const m = base(), o = porNombre(m, 'Alfa');
    if (o.tipo !== 'objeto')
        throw Error();
    verificar('F-13', modificar(m, 'cosas', o.id, { ...o, valor: '12' }));
});
caso('T-022 T-040 200 semillas válidas y deterministas; mutante no tautológico', () => {
    for (let s = 0; s < 200; s++) {
        const m = azar(s);
        buenos.push(m);
        expect(azar(s)).toEqual(m);
        expect(validarForma(m)).toEqual([]);
    }
    const m = azar(1);
    verificar('F-9', { ...m, secuencia: 0 });
});
caso('T-015 T-032 T-028 positivos de estados, escisión, atributos y abanicos; mutantes por campo', () => {
    const m = base(), a = porNombre(m, 'Alfa'), b = porNombre(m, 'Beta'), p = porNombre(m, 'Gamma'), q = porNombre(m, 'Delta');
    if (a.tipo !== 'objeto' || b.tipo !== 'objeto')
        throw Error();
    const aa = a.estados[0]!.id, ab = a.estados[1]!.id, bb = b.estados[0]!.id;
    const es: Enlace[] = [{ id: 'e-100', tipo: 'efecto', objeto: a.id, proceso: p.id, entrada: aa, escision: { par: 'e-101', mitad: 'entrada' } }, { id: 'e-101', tipo: 'efecto', objeto: a.id, proceso: q.id, salida: ab, escision: { par: 'e-100', mitad: 'salida' } }, { id: 'e-102', tipo: 'exhibicion', refinable: a.id, refinador: b.id }, { id: 'e-103', tipo: 'generalizacion', refinable: a.id, refinador: b.id, estados: { general: aa, especializacion: bb } }, { id: 'e-104', tipo: 'etiquetado', origen: a.id, destino: b.id, estadoOrigen: aa, estadoDestino: bb }, { id: 'e-105', tipo: 'etiquetadoBidireccional', origen: a.id, destino: b.id, estadoOrigen: aa, etiqueta: 'tiene', inversa: 'pertenece' }, { id: 'e-106', tipo: 'reciproco', origen: a.id, destino: b.id, estados: { origen: aa, destino: bb } }];
    const bueno = congelar({ ...m, secuencia: 110, cosas: { ...m.cosas, [a.id]: { ...a, porDefecto: aa, current: ab }, [b.id]: { ...b, valor: '12' } }, enlaces: Object.fromEntries(es.map(e => [e.id, e])), abanicos: { 'f-108': { id: 'f-108', operador: 'OR' as const, enlaces: ['e-100', 'e-101'] } } });
    buenos.push(bueno);
    expect(validarForma(bueno)).toEqual([]);
    for (const e of es) {
        if (e.tipo === 'generalizacion')
            verificar('F-3', modificar(bueno, 'enlaces', e.id, { ...e, estados: { general: bb, especializacion: aa } }));
        if (e.tipo === 'etiquetado' || e.tipo === 'etiquetadoBidireccional')
            verificar('F-3', modificar(bueno, 'enlaces', e.id, { ...e, estadoOrigen: bb }));
        if (e.tipo === 'reciproco')
            verificar('F-3', modificar(bueno, 'enlaces', e.id, { ...e, estados: { origen: bb } }));
        if (e.tipo === 'efecto')
            verificar('F-4', modificar(bueno, 'enlaces', e.id, { ...e, control: 'c' }));
    }
    verificar('F-6', { ...bueno, abanicos: { ...bueno.abanicos, 'f-109': { id: 'f-109', operador: 'XOR', enlaces: ['e-100', 'e-101'] } } });
    verificar('F-1', modificar(bueno, 'cosas', a.id, { ...a, porDefecto: bb }));
});
caso('T-078 árbol legal; mutantes ciclo, refinamiento repetido, orden y alcance externo', () => {
    const m = base(), p = porNombre(m, 'Gamma'), q = porNombre(m, 'Delta'), a = porNombre(m, 'Alfa');
    const caja = { x: 0, y: 0, ancho: 135, alto: 60 };
    const raíz = m.opds[m.raiz]!;
    const { [a.id]: omitida, [q.id]: omitido, ...sinInterno } = raíz.apariciones;
    void omitida;
    void omitido;
    const hijo: Opd = { id: 'opd-100', tipo: 'descomposicion', padre: m.raiz, cosa: p.id, orden: 0, bandas: [[q.id]], objetosInternos: [a.id], apariciones: { [p.id]: caja, [q.id]: caja, [a.id]: caja } };
    const bueno = congelar({ ...m, secuencia: 102, opds: { [m.raiz]: { ...raíz, apariciones: sinInterno }, [hijo.id]: hijo } });
    buenos.push(bueno);
    expect(validarForma(bueno)).toEqual([]);
    verificar('F-7', modificar(bueno, 'opds', hijo.id, { ...hijo, padre: hijo.id }));
    verificar('F-7', modificar(bueno, 'opds', hijo.id, { ...hijo, orden: 2 }));
    verificar('F-7', modificar(bueno, 'opds', 'opd-101', { ...hijo, id: 'opd-101', padre: hijo.id, cosa: p.id, orden: 0 }));
    verificar('F-8', modificar(bueno, 'opds', m.raiz, { ...raíz, apariciones: { ...sinInterno, [a.id]: caja } }));
    verificar('F-8', modificar(bueno, 'opds', hijo.id, { ...hijo, bandas: [[q.id, q.id]] }));
});
caso('T-040 T-054 F-5 noOfrecido recibe también cada abanico', () => { const m = base(), a = porNombre(m, 'Alfa'), b = porNombre(m, 'Beta'); const e: Enlace = { id: 'e-100', tipo: 'etiquetado', origen: a.id, destino: b.id, etiqueta: 'solo-abanico' }; const segundo: Enlace = { ...e, id: 'e-101' }; const bueno = { ...m, secuencia: 103, enlaces: { 'e-100': e, 'e-101': segundo } }; expect(validarForma(bueno)).toEqual([]); verificar('F-5', { ...bueno, abanicos: { 'f-102': { id: 'f-102', operador: 'OR', enlaces: ['e-100', 'e-101'] } } }); });
caso('T-022 F-1 no confunde propiedades heredadas del Record con ids presentes', () => { const m = base(), p = porNombre(m, 'Gamma'); const e: Enlace = { id: 'e-100', tipo: 'consumo', objeto: 'toString', proceso: p.id }; verificar('F-1', modificar({ ...m, secuencia: 101 }, 'enlaces', e.id, e)); });
caso('T-022 F-1 y F-7 raíz heredada se diagnostica sin excepción', () => { const m = congelar({ ...modeloCon(), raiz: 'toString' }); const vs = validarForma(m); expect(vs.map(v => v.codigo)).toContain('F-1'); expect(vs.map(v => v.codigo)).toContain('F-7'); });
caso('T-078 F-7 refinamiento exige apariciones propias aunque la cosa se llame toString', () => { const vacío = modeloCon(); const cosa = { id: 'toString', tipo: 'proceso' as const, nombre: 'Contener', esencia: 'informacional' as const, afiliacion: 'sistemica' as const }; const m = congelar({ ...vacío, secuencia: 101, cosas: { toString: cosa }, opds: { 'opd-1': { id: 'opd-1', tipo: 'raiz' as const, apariciones: {} }, 'opd-100': { id: 'opd-100', tipo: 'descomposicion' as const, padre: 'opd-1', cosa: cosa.id, orden: 0, bandas: [], objetosInternos: [], apariciones: {} } } }); expect(validarForma(m).map(v => v.codigo)).toContain('F-7'); });
caso('T-030 F-8 subproceso con id toString necesita aparición propia y no hereda externas', () => { const vacío = modeloCon(); const contenedor = { id: 'p-2', tipo: 'proceso' as const, nombre: 'Contener', esencia: 'informacional' as const, afiliacion: 'sistemica' as const }, interno = { ...contenedor, id: 'toString', nombre: 'Ejecutar' }; const caja = { x: 0, y: 0, ancho: 420, alto: 188 }; const raíz = { id: 'opd-1', tipo: 'raiz' as const, apariciones: { 'p-2': caja } }; const hijo = { id: 'opd-100', tipo: 'descomposicion' as const, padre: 'opd-1', cosa: 'p-2', orden: 0, bandas: [['toString']], objetosInternos: [], apariciones: { 'p-2': caja } }; const sin = congelar({ ...vacío, secuencia: 101, cosas: { 'p-2': contenedor, toString: interno }, opds: { 'opd-1': raíz, 'opd-100': hijo } }); expect(validarForma(sin).map(v => v.codigo)).toContain('F-8'); const válido = congelar({ ...sin, opds: { 'opd-1': raíz, 'opd-100': { ...hijo, apariciones: { ...hijo.apariciones, toString: { x: 40, y: 64, ancho: 135, alto: 60 } } } } }); buenos.push(válido); expect(validarForma(válido)).toEqual([]); });
