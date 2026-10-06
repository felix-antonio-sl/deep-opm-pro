import { expect, test } from 'bun:test';
import { natural, ordenar } from './v0';

test('T-286 colación natural conserva bytes y fallback Unicode/números/opacos', () => {
    const claves = ['p-2', 'p-10', 'p-02', 'P-2', 'p-0', 'p-001', '01', '1', '10', '2', '0',
        'á', 'a\u0301', 'a', 'Á', 'ñ', 'n', 'Ñ', '', '__proto__', 'constructor', 'toString', '🌳', 'o-12345678901234567890'];
    const previo = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true }) || (a < b ? -1 : a > b ? 1 : 0);
    for (const a of claves) for (const b of claves) expect(Math.sign(natural(a, b))).toBe(Math.sign(previo(a, b)));
    for (const xs of [claves, [...claves].reverse(), [...claves.slice(10), ...claves.slice(0, 10)]]) {
        const r = Object.fromEntries(xs.map((k, i) => [k, { i, k }])), antes = JSON.stringify(r);
        const esperado = Object.fromEntries(Object.entries(r).sort(([a], [b]) => previo(a, b)));
        expect(JSON.stringify(ordenar(r))).toBe(JSON.stringify(esperado)); expect(JSON.stringify(r)).toBe(antes);
    }
});
