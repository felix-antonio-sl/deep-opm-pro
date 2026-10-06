import { expect, test } from 'bun:test';
import { azar } from './pruebas/azar';
import { validarForma } from './nucleo/forma';
import { erroresContexto } from './nucleo/matriz';
import { aplicarAccion } from './nucleo/operaciones';
import { proyectar } from './nucleo/proyeccion';
import { diagnosticar, gatesExportacion } from './nucleo/diagnostico';
import { escena } from './opd/escena';
import { dibujar } from './opd/dibujo';
import { generarModelo } from './opl/generar';
import { generarDocumentoOpl } from './opl/documento';
import { planificar } from './opl/planificar';
import { importarV0 } from './codec/importar';
import { exportarV0 } from './codec/exportar';

const SEMILLA_HODOM = 19450;
test('WP-10 DESIGN §2.4 perfil HODOM real, exacto, determinista y válido', () => {
    const m = azar(SEMILLA_HODOM, 'hodom'), antes = JSON.stringify(m);
    expect([Object.keys(m.cosas).length, Object.values(m.cosas).flatMap(c => c.tipo === 'objeto' ? c.estados : []).length,
        Object.keys(m.enlaces).length, Object.keys(m.opds).length]).toEqual([262, 192, 433, 36]);
    expect(validarForma(m)).toEqual([]);
    expect(erroresContexto(m)).toEqual([]);
    expect(gatesExportacion(m, 'modelo')).toEqual([]);
    expect(Object.values(m.opds).every(o => Object.keys(o.apariciones).length <= 25)).toBe(true);
    expect(JSON.stringify(azar(SEMILLA_HODOM, 'hodom'))).toBe(antes);
    expect(JSON.stringify(azar(SEMILLA_HODOM + 1, 'hodom'))).not.toBe(antes);
    expect(JSON.stringify(m)).toBe(antes);
});

// Dos trabajos independientes por meta: primera identidad fría y otra identidad de
// uso normal; nunca se mide una segunda consulta sobre la misma respuesta cacheada.
function medir<T>(meta: string, limite: number, preparar: () => () => T, comprobar: (r: T) => void) {
    for (const muestra of ['frío', 'normal'] as const) {
        const trabajo = preparar(), inicio = performance.now(), r = trabajo(), ms = performance.now() - inicio;
        comprobar(r);
        expect(ms, `${meta}/${muestra}`).toBeLessThan(limite);
    }
}
test('WP-10 DESIGN §2.4 operación nuclear efectiva incluye cierre DS20 <9ms', () => {
    medir('operación DS20', 9, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => aplicarAccion(m, { op: 'renombrarModelo', args: { nombre: 'HODOM actualizado' } }); }, r => {
        expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r));
        expect(r.valor.modelo.nombre).toBe('HODOM actualizado'); expect(validarForma(r.valor.modelo)).toEqual([]); expect(erroresContexto(r.valor.modelo)).toEqual([]);
    });
});
test('WP-10 DESIGN §2.4 proyectar OPD real <9ms', () => {
    medir('proyectar', 9, () => { const m = azar(SEMILLA_HODOM, 'hodom'), opd = Object.values(m.opds).find(o => o.tipo === 'descomposicion' && o.objetosInternos.length)!; return () => proyectar(m, opd.id); }, r => { expect(r.cosas.length).toBe(9); expect(r.enlaces.length).toBeGreaterThan(0); });
});
test('WP-10 DESIGN §2.4 escena y dibujo OPD≤25 en modelo completo <15ms', () => {
    medir('escena+dibujar', 15, () => { const m = azar(SEMILLA_HODOM, 'hodom'), opd = Object.values(m.opds).find(o => o.tipo === 'descomposicion' && o.objetosInternos.length)!; expect(Object.keys(opd.apariciones).length).toBe(9); return () => dibujar(escena(m, opd.id), 'canon'); }, r => { expect(r.t).toBe('g'); expect(r.h!.length).toBeGreaterThan(0); });
});
test('WP-10 DESIGN §2.4 generarModelo36 bloques <75ms', () => {
    medir('generarModelo', 75, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => generarModelo(m); }, r => { expect(new Set(r.map(l => l.opd)).size).toBe(36); });
});
test('WP-10 DESIGN §2.4 diagnosticar modelo completo <90ms', () => {
    medir('diagnosticar', 90, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => diagnosticar(m); }, r => { expect(r.filter(d => d.severidad === 'error')).toEqual([]); });
});
test('T-287 WP-10 importarV0 completo <450ms', () => {
    medir('importarV0', 450, () => { const json = exportarV0(azar(SEMILLA_HODOM, 'hodom')); return () => importarV0(json); }, r => { expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r)); expect(Object.keys(r.modelo.enlaces).length).toBe(433); expect(r.informe.descartado).toEqual([]); });
});
test('T-286 WP-10 exportarV0 completo <60ms', () => {
    medir('exportarV0', 60, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => exportarV0(m); }, r => { expect(r.endsWith('\n')).toBe(true); expect(Object.keys(JSON.parse(r).modelo.entidades).length).toBe(262); });
});
test('WP-10 DESIGN §2.4 planificar1000 líneas genuinas <180ms', () => {
    medir('planificar1000', 180, () => {
        const m = azar(SEMILLA_HODOM, 'hodom'), originales = generarDocumentoOpl(m).split('\n').filter(l => l.trim());
        const lineas = Array.from({ length: 1000 }, (_, i) => originales[i % originales.length]!);
        expect(lineas).toHaveLength(1000); const texto = lineas.join('\n');
        return () => planificar(m, 'modelo', texto);
    }, r => { expect(r.lineas).toHaveLength(1000); expect(r.acciones).toEqual([]); expect(r.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error'))).toEqual([]); });
});
