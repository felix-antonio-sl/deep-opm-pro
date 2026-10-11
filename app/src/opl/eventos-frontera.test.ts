import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { descomponer } from '../nucleo/refinamiento';
import { crearCosa } from '../nucleo/cosas';
import { crearEnlace, reanclarExtremo } from '../nucleo/enlaces';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarBloque, textoCanonico } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';

for (const afiliacion of ['sistemica', 'ambiental'] as const)
    test(`T-060 T-192 T-196 evento al proceso completo e interno ${afiliacion}: OPL auténtico y punto fijo JSON`, () => {
        const base = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Procesar'] });
        const b = { ...base, cosas: Object.fromEntries(Object.entries(base.cosas).map(([id, c]) => [id, { ...c, afiliacion }])) };
        const d = must(descomponer(b, { opd: b.raiz, proceso: porNombre(b, 'Procesar').id, bandas: [['Inspeccionar'], ['Aceptar']] }));
        const c = must(crearCosa(d.modelo, { opd: d.creados[0]!, tipo: 'objeto', nombre: 'Aviso', x: 240, y: 170, alcance: 'interno' }));
        const entero = must(crearEnlace(c.modelo, { opd: b.raiz, candidato: { tipo: 'instrumento', objeto: porNombre(b, 'Pedido').id, proceso: porNombre(b, 'Procesar').id, control: 'e' } }));
        const interno = must(crearEnlace(entero.modelo, { opd: d.creados[0]!, candidato: { tipo: 'instrumento', objeto: c.creados[0]!, proceso: porNombre(c.modelo, 'Inspeccionar').id, control: 'e' } }));
        const m = interno.modelo, antes = exportarV0(m); expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
        const t = generarDocumentoOpl(m);
        expect(t).toContain('**Pedido** inicia *Procesar*, que requiere **Pedido**.');
        expect(t).toContain('**Aviso** inicia *Inspeccionar*, que requiere **Aviso**.');
        expect(t).not.toContain('**Pedido** inicia *Inspeccionar*');
        for (const opd of Object.keys(m.opds)) {
            const plan = planificar(m, opd, textoCanonico(generarBloque(m, opd)));
            expect(plan.acciones).toEqual([]); expect(plan.resumen.noAplicables).toBe(0);
        }
        const r = importarOpl(m.nombre, t); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
        expect(r.valor.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);
        expect(gatesExportacion(r.valor.modelo, 'modelo')).toEqual([]);
        const codec = importarV0(antes); expect(codec.ok).toBe(true); if (!codec.ok) throw Error(JSON.stringify(codec.informe));
        expect(exportarV0(codec.modelo)).toBe(antes); expect(exportarV0(m)).toBe(antes);
    });

for (const afiliacion of ['sistemica', 'ambiental'] as const)
    test(`T-060 T-180 edición OPL ${afiliacion} informa cruce prohibido y conserva condición e identidad`, () => {
        const b = modeloCon({ objetos: [['Pedido', []]], procesos: ['Procesar'] });
        const base = { ...b, cosas: Object.fromEntries(Object.entries(b.cosas).map(([id, c]) => [id, { ...c, afiliacion }])) };
        const e = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'instrumento', objeto: porNombre(base, 'Pedido').id, proceso: porNombre(base, 'Procesar').id, control: 'c' } }));
        const d = must(descomponer(e.modelo, { opd: base.raiz, proceso: porNombre(base, 'Procesar').id, bandas: [['Inspeccionar'], ['Aceptar']] }));
        const m = must(reanclarExtremo(d.modelo, { opd: d.creados[0]!, enlace: e.creados[0]!, extremo: 'destino', hacia: { cosa: porNombre(d.modelo, 'Inspeccionar').id } })).modelo;
        const antes = exportarV0(m), t = generarDocumentoOpl(m), condicion = '*Inspeccionar* ocurre si **Pedido** existe, de lo contrario *Inspeccionar* se omite.';
        expect(t).toContain(condicion);
        const p = planificar(m, 'modelo', t.replace(condicion, '**Pedido** inicia *Inspeccionar*, que requiere **Pedido**.'));
        expect(p.resumen.noAplicables).toBe(1);
        expect(p.lineas.flatMap(l => l.diagnosticos).some(d => d.severidad === 'error' && d.mensaje.includes('Un evento externo no puede atravesar'))).toBe(true);
        expect(p.acciones).toEqual([]);
        const r = must(aplicarPlan(m, p)); expect(r.modelo).toBe(m); expect(exportarV0(r.modelo)).toBe(antes);
    });
