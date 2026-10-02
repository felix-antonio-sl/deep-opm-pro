import { test, expect, mock, afterEach } from 'bun:test';
import { modeloCon, congelar } from '../pruebas/constructores';
import type { Modelo } from './tipos';
import type { Violacion } from './resultado';
const aislado = process.env.OPFORJA_WP1_AISLADO === 'resultado';
function caso(nombre: string, cuerpo: () => void): void {
    test(nombre, aislado ? cuerpo : () => {
        const filtro = '^' + nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$';
        const p = Bun.spawnSync([process.execPath, '--no-env-file', 'test', import.meta.path, '-t', filtro], { env: { ...process.env, OPFORJA_WP1_AISLADO: 'resultado' } });
        expect(p.exitCode, new TextDecoder().decode(p.stdout) + new TextDecoder().decode(p.stderr)).toBe(0);
    });
}
const errores = (m: Modelo): readonly Violacion[] => m.nombre.startsWith('error') ? [{ codigo: 'prueba-contexto', regla: 'producto', mensaje: 'Error de prueba', refs: (m.nombre.split(':')[1] ?? 'o-1').split(',').map(id => ({ tipo: 'cosa' as const, id })) }] : [];
if (aislado)
    mock.module('./matriz', () => ({ erroresContexto: errores, MATRIZ: {}, noOfrecido: () => { throw new Error('fuera del doble de transacción'); } }));
const { transaccion } = await import('./resultado');
const { aplicarAcciones, aplicarAccion, etiquetaAccion, OPERACIONES } = await import('./operaciones');
const { fijarDescripcionModelo } = await import('./modelo');
const { validarForma } = await import('./forma');
const entrada = modeloCon();
afterEach(() => expect(validarForma(entrada)).toEqual([]));
caso('T-011 transacción copia caminos, ids, trazas, rechazo y rollback', () => {
    const r = transaccion(entrada, tx => { expect(tx.m).toBe(entrada); const id = tx.nuevoId('o'); tx.poner('cosas', { id, tipo: 'objeto', nombre: 'Alfa', esencia: 'informacional', afiliacion: 'sistemica', estados: [] }); tx.traza({ regla: 'producto', mensaje: 'Creado', refs: [] }); });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    expect(r.valor.creados).toEqual(['o-2']);
    expect(r.valor.modelo.secuencia).toBe(3);
    expect(r.valor.modelo.opds).toBe(entrada.opds);
    expect(r.trazas.length).toBe(1);
    expect(entrada.cosas).toEqual({});
    expect(validarForma(r.valor.modelo)).toEqual([]);
    const rechazo = { codigo: 'forma' as const, regla: 'producto', mensaje: 'No', refs: [] };
    expect(transaccion(entrada, tx => { tx.nuevoId('p'); tx.rechazar(rechazo); })).toEqual({ ok: false, rechazo });
    expect(entrada.secuencia).toBe(2);
    expect(() => transaccion(entrada, () => { throw new Error('inesperado'); })).toThrow('inesperado');
});
caso('T-011 DS-20 rechaza error nuevo; tolera viejo y compara refs', () => {
    const nuevo = transaccion(entrada, tx => tx.modelo({ nombre: 'error:o-1' }));
    expect(nuevo.ok).toBe(false);
    if (nuevo.ok)
        return;
    expect(nuevo.rechazo.codigo).toBe('contexto');
    const viejo = congelar({ ...entrada, nombre: 'error:o-1' });
    expect(transaccion(viejo, tx => tx.modelo({ descripcion: 'Cambio' })).ok).toBe(true);
    expect(transaccion(viejo, tx => tx.modelo({ nombre: 'error:o-2' })).ok).toBe(false);
    const ordenados = congelar({ ...entrada, nombre: 'error:o-1,o-2' });
    expect(transaccion(ordenados, tx => tx.modelo({ nombre: 'error:o-2,o-1' })).ok).toBe(true);
    expect(transaccion(entrada, tx => tx.modelo({ nombre: 'error:o-1' }), { permiteErroresNuevos: true }).ok).toBe(true);
});
caso('T-011 operaciones aplican secuencia atómica y preservan entrada', () => {
    expect(Object.keys(OPERACIONES).length).toBe(47);
    expect(aplicarAcciones(entrada, [])).toEqual({ ok: true, valor: { modelo: entrada, creados: [] }, trazas: [] });
    const r = aplicarAcciones(entrada, [{ op: 'renombrarModelo', args: { nombre: 'Nuevo' } }, { op: 'fijarUnidadTiempo', args: { unidad: 'hour' } }]);
    expect(r.ok).toBe(true);
    if (r.ok) {
        expect(r.valor.modelo.nombre).toBe('Nuevo');
        expect(r.valor.modelo.unidadTiempo).toBe('hour');
    }
    const mal = aplicarAcciones(entrada, [{ op: 'renombrarModelo', args: { nombre: 'Nuevo' } }, { op: 'renombrarModelo', args: { nombre: 'error:o-1' } }]);
    expect(mal.ok).toBe(false);
    expect(entrada.nombre).toBe('Prueba');
    expect(aplicarAccion(entrada, { op: 'renombrarModelo', args: { nombre: 'Uno' } }).ok).toBe(true);
});
caso('T-004 descripción nula quita metadato sin alterar hechos', () => {
    const con = congelar({ ...entrada, descripcion: 'Texto' });
    const r = fijarDescripcionModelo(con, { texto: null });
    expect(r.ok).toBe(true);
    if (r.ok) {
        expect('descripcion' in r.valor.modelo).toBe(false);
        expect(r.valor.modelo.cosas).toBe(entrada.cosas);
    }
    expect(con.descripcion).toBe('Texto');
});
caso('T-011 etiqueta del historial expresa la operación en español', () => { const m = modeloCon({ procesos: ['Cocinar'] }); const proceso = Object.values(m.cosas)[0]!.id; expect(etiquetaAccion(m, { op: 'descomponer', args: { opd: m.raiz, proceso } })).toBe('Descomponer *Cocinar*'); expect(etiquetaAccion(m, { op: 'renombrarModelo', args: { nombre: 'Nuevo' } })).toBe('Renombrar modelo'); });
