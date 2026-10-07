import { expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { importarV0 } from '../codec/importar';
import { exportarV0 } from '../codec/exportar';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { generarBloque, textoCanonico } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';
import { azar } from '../pruebas/azar';

const dir = new URL('../../fixtures/v0/', import.meta.url);
// Gates del Modelo importado, sin limpiar hechos ni convertir rechazo en roundtrip.
const rechazos: Readonly<Record<string, readonly (readonly [string, string])[]>> = {
    // DEC33: R-ROL-UNIC-1 rige por proceso.
    'OnStar_System.json': [['R-INV-2B', 'e-93']],
    'SD_Async.json': [['R-ROL-UNIC-1', 'e-25'], ['R-ROL-UNIC-1', 'e-27'], ['R-ROL-UNIC-1', 'e-29'], ['R-ROL-UNIC-1', 'e-31'], ['R-ROL-UNIC-1', 'e-66'], ['R-ROL-UNIC-1', 'e-68'], ['R-ROL-UNIC-1', 'e-70'], ['R-ROL-UNIC-1', 'e-72'], ['R-EFE-1', 'e-76'], ['R-EFE-1', 'e-78'], ['R-EFE-1', 'e-80'], ['T-025, R-§18-LEX-1', 'o-51'], ['T-025, R-§18-LEX-1', 'o-53'], ['A8.2', 'e-74']],
    'SD_Sync.json': [['R-EFE-1', 'e-88'], ['R-EFE-1', 'e-94'], ['R-EFE-1', 'e-96'], ['R-EFE-1', 'e-98'], ['R-INV-2B', 'e-102'], ['R-INV-2B', 'e-104'], ['R-INV-2B', 'e-106'], ['T-025, R-§18-LEX-1', 'o-80'], ['T-025, R-§18-LEX-1', 'o-82']],
};
for (const nombre of readdirSync(dir).filter(n => n.endsWith('.json')).sort()) {
    test(`T-191 T-196 WP-10 auto-reparseo de cada OPD real ${nombre}`, () => {
        const r = importarV0(readFileSync(new URL(nombre, dir), 'utf8'));
        expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
        const m = r.modelo, antes = exportarV0(m), informe = JSON.stringify(r.informe);
        expect(validarForma(m)).toEqual([]);
        for (const opd of Object.keys(m.opds)) {
            const t = textoCanonico(generarBloque(m, opd)), p = planificar(m, opd, t);
            expect(p.acciones, `${nombre}/${opd}`).toEqual([]);
            expect(p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error')), `${nombre}/${opd}`).toEqual([]);
            const a = aplicarPlan(m, p); expect(a.ok).toBe(true);
            if (!a.ok) throw Error(JSON.stringify(a));
            expect(a.valor.modelo).toBe(m); expect(exportarV0(a.valor.modelo)).toBe(antes);
        }
        expect(exportarV0(m)).toBe(antes); expect(JSON.stringify(r.informe)).toBe(informe);
    });
    test(`T-192 WP-10 documento real estricto según gates ${nombre}`, () => {
        const r = importarV0(readFileSync(new URL(nombre, dir), 'utf8'));
        expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
        const m = r.modelo, antes = exportarV0(m), gates = gatesExportacion(m, 'modelo');
        expect(gates.map(g => [g.regla, g.refs[0]!.id])).toEqual((rechazos[nombre] ?? []).map(([regla, id]) => [regla, id]));
        if (gates.length) {
            expect(gates.every(g => g.regla && g.refs)).toBe(true);
        } else {
            const t = generarDocumentoOpl(m), a = importarOpl(m.nombre, t);
            expect(a.ok).toBe(true); if (!a.ok) throw Error(JSON.stringify(a));
            expect(a.valor.plan.resumen.noAplicables).toBe(0);
            expect(generarDocumentoOpl(a.valor.modelo)).toBe(t);
        }
        expect(exportarV0(m)).toBe(antes);
    });
}

test('T-191 T-192 T-196 WP-10 HODOM36 OPDs auto y documento estricto', () => {
    const m = azar(19450, 'hodom'), antes = exportarV0(m);
    expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
    expect(Object.keys(m.opds)).toHaveLength(36);
    for (const opd of Object.keys(m.opds)) {
        const t = textoCanonico(generarBloque(m, opd)), p = planificar(m, opd, t);
        expect(p.acciones, opd).toEqual([]);
        expect(p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error')), opd).toEqual([]);
        const a = aplicarPlan(m, p); expect(a.ok).toBe(true); if (!a.ok) throw Error(JSON.stringify(a));
        expect(a.valor.modelo).toBe(m); expect(exportarV0(a.valor.modelo)).toBe(antes);
    }
    const t = generarDocumentoOpl(m), a = importarOpl(m.nombre, t);
    expect(a.ok).toBe(true); if (!a.ok) throw Error(JSON.stringify(a));
    expect(a.valor.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(a.valor.modelo)).toBe(t);
    expect(exportarV0(m)).toBe(antes);
}, 60000);
