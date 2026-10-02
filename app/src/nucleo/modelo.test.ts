import { test, expect, afterEach } from 'bun:test';
import { crearModelo } from './modelo';
import { validarForma } from './forma';
let m = crearModelo({ id: 'm-prueba', nombre: 'Prueba' });
afterEach(() => expect(validarForma(m)).toEqual([]));
test('T-022 modelo inicial tiene raíz opaca y secuencia única', () => { m = crearModelo({ id: 'm-prueba', nombre: 'Prueba' }); expect(m.raiz).toBe('opd-1'); expect(m.secuencia).toBe(2); expect(m.unidadTiempo).toBe('min'); expect(m.opds[m.raiz]).toEqual({ id: 'opd-1', tipo: 'raiz', apariciones: {} }); });
