import { test, expect } from 'bun:test';
import { ID_ELEMENTO, ID_MODELO, idModelo, sufijoId } from './ids';
test('T-022 ids de elementos conservables y modelos seguros', () => {
    for (const s of ['o-2', 'Ab.c:~_1'])
        expect(ID_ELEMENTO.test(s)).toBe(true);
    for (const s of ['', 'x'.repeat(81), 'a/b'])
        expect(ID_ELEMENTO.test(s)).toBe(false);
    for (const s of ['m-1', 'Ab_2'])
        expect(ID_MODELO.test(s)).toBe(true);
    for (const s of ['.tmp-1', 'a/b', 'a.b', '../a'])
        expect(ID_MODELO.test(s)).toBe(false);
    const ids = Array.from({ length: 100 }, idModelo);
    expect(new Set(ids).size).toBe(100);
    for (const id of ids)
        expect(id).toMatch(/^m-[0-9a-f]{12}$/);
    expect(sufijoId('opd-123')).toBe(123);
    expect(sufijoId('opd-x')).toBe(0);
});
