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
        const d = must(descomponer(b, { opd: b.raiz, cosa: porNombre(b, 'Procesar').id, bandas: [['Inspeccionar'], ['Aceptar']] }));
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

function eventoReanclado(afiliacion: 'sistemica' | 'ambiental') {
    const b = modeloCon({ objetos: [['Pedido', []]], procesos: ['Procesar'] });
    const base = { ...b, cosas: Object.fromEntries(Object.entries(b.cosas).map(([id, c]) => [id, { ...c, afiliacion }])) };
    const e = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'instrumento', objeto: porNombre(base, 'Pedido').id, proceso: porNombre(base, 'Procesar').id, control: 'c' } }));
    const d = must(descomponer(e.modelo, { opd: base.raiz, cosa: porNombre(base, 'Procesar').id, bandas: [['Inspeccionar'], ['Aceptar']] }));
    return { m: must(reanclarExtremo(d.modelo, { opd: d.creados[0]!, enlace: e.creados[0]!, extremo: 'destino', hacia: { cosa: porNombre(d.modelo, 'Inspeccionar').id } })).modelo, enlace: e.creados[0]! };
}
const condicion = '*Inspeccionar* ocurre si **Pedido** existe, de lo contrario *Inspeccionar* se omite.';
const evento = '**Pedido** inicia *Inspeccionar*, que requiere **Pedido**.';

test('T-060 T-180 edición OPL sistemica informa cruce prohibido y conserva condición e identidad', () => {
    const { m } = eventoReanclado('sistemica'), antes = exportarV0(m), t = generarDocumentoOpl(m);
    expect(t).toContain(condicion);
    const p = planificar(m, 'modelo', t.replace(condicion, evento));
    expect(p.resumen.noAplicables).toBe(1);
    expect(p.lineas.flatMap(l => l.diagnosticos).some(d => d.severidad === 'error' && d.mensaje.includes('Un evento sistémico externo no puede atravesar'))).toBe(true);
    expect(p.acciones).toEqual([]);
    const r = must(aplicarPlan(m, p)); expect(r.modelo).toBe(m); expect(exportarV0(r.modelo)).toBe(antes);
});

test('T-060 T-180 edición OPL ambiental cruza el contorno, conserva identidad y alcanza punto fijo', () => {
    const { m, enlace } = eventoReanclado('ambiental'), t = generarDocumentoOpl(m);
    expect(t).toContain(condicion);
    const editado = t.replace(condicion, evento), p = planificar(m, 'modelo', editado);
    expect(p.resumen.noAplicables).toBe(0);
    expect(p.lineas.flatMap(l => l.diagnosticos).filter(d => d.severidad === 'error')).toEqual([]);
    const r = must(aplicarPlan(m, p));
    expect(r.modelo.enlaces[enlace]).toEqual({ id: enlace, tipo: 'instrumento', objeto: porNombre(m, 'Pedido').id, proceso: porNombre(m, 'Inspeccionar').id, control: 'e' });
    expect(validarForma(r.modelo)).toEqual([]); expect(gatesExportacion(r.modelo, 'modelo')).toEqual([]);
    // SD proyecta el mismo enlace sobre el proceso completo: su oración sigue al hecho editado.
    const t2 = generarDocumentoOpl(r.modelo);
    expect(t2).toBe(editado.replace('*Procesar* ocurre si **Pedido** existe, de lo contrario *Procesar* se omite.', '**Pedido** inicia *Procesar*, que requiere **Pedido**.'));
    const fijo = planificar(r.modelo, 'modelo', t2); expect(fijo.acciones).toEqual([]); expect(fijo.resumen.noAplicables).toBe(0);
    const texto = exportarV0(r.modelo), codec = importarV0(texto); expect(codec.ok).toBe(true); if (!codec.ok) throw Error(JSON.stringify(codec.informe));
    expect(exportarV0(codec.modelo)).toBe(texto);
});
