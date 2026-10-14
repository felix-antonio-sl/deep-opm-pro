import { test, expect, afterEach } from 'bun:test';
import { crearModelo,renombrarModelo } from './modelo';
import { validarForma } from './forma';
let m = crearModelo({ id: 'm-prueba', nombre: 'Prueba' });
afterEach(() => expect(validarForma(m)).toEqual([]));
test('T-022 modelo inicial tiene raíz opaca y secuencia única', () => { m = crearModelo({ id: 'm-prueba', nombre: 'Prueba' }); expect(m.raiz).toBe('opd-1'); expect(m.secuencia).toBe(2); expect(m.unidadTiempo).toBe('min'); expect(m.opds[m.raiz]).toEqual({ id: 'opd-1', tipo: 'raiz', apariciones: {} }); });
test('T-022 UI-10 renombrar rechaza nombres vacíos y conserva la base al confirmar sin cambio',()=>{
 const b=crearModelo({id:'m-nombre',nombre:'  Modelo identificable  '});expect(b.nombre).toBe('Modelo identificable');
 for(const nombre of ['','   ','\t\n']){const r=renombrarModelo(b,{nombre});expect(r.ok).toBe(false);if(!r.ok)expect(r.rechazo.regla).toBe('producto');}
 const igual=renombrarModelo(b,{nombre:' Modelo identificable '});expect(igual.ok).toBe(true);if(igual.ok)expect(igual.valor.modelo).toBe(b);
 const cambio=renombrarModelo(b,{nombre:'  Otro modelo  '});expect(cambio.ok).toBe(true);if(cambio.ok)expect(cambio.valor.modelo.nombre).toBe('Otro modelo');
});
