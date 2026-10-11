import { expect, test } from 'bun:test';
import type { Modelo } from '../nucleo/tipos';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace, fijarControl, reanclarExtremo } from '../nucleo/enlaces';
import { descomponer } from '../nucleo/refinamiento';
import { gatesExportacion } from '../nucleo/diagnostico';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { generarBloque, textoCanonico } from './generar';

// ISO §14.2.2.4.3 y Tabla 25: el par escindido o el cambio completo en un subproceso; sólo la mitad de
// entrada carece de versión con control (B-46, DEC50).
function escindido() {
    const b = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Procesar'] }), o = porNombre(b, 'Pedido');
    if (o.tipo !== 'objeto') throw Error('Objeto esperado.');
    const e = must(crearEnlace(b, { opd: b.raiz, candidato: { tipo: 'efecto', objeto: o.id, proceso: porNombre(b, 'Procesar').id, entrada: o.estados[0]!.id, salida: o.estados[1]!.id } }));
    const d = must(descomponer(e.modelo, { opd: b.raiz, proceso: porNombre(b, 'Procesar').id, bandas: [['Recibir'], ['Despachar']] }));
    const salida = Object.values(d.modelo.enlaces).find(x => x.tipo === 'efecto' && x.escision?.mitad === 'salida')!;
    return { m: d.modelo, hijo: d.creados[0]!, salida: salida.id };
}
function estricto(m: Modelo): string {
    expect(gatesExportacion(m, 'modelo')).toEqual([]);
    for (const opd of Object.keys(m.opds)) { const p = planificar(m, opd, textoCanonico(generarBloque(m, opd))); expect(p.acciones).toEqual([]); expect(p.resumen.noAplicables).toBe(0); }
    const t = generarDocumentoOpl(m), r = importarOpl(m.nombre, t); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    expect(r.valor.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);
    return t;
}

test('T-074 T-192 la mitad de salida con condición emite CS4 y vuelve al mismo texto', () => {
    const x = escindido(), m = must(fijarControl(x.m, { enlace: x.salida, control: 'c' })).modelo;
    expect(estricto(m)).toContain('*Despachar* ocurre si **Pedido** existe, en cuyo caso *Despachar* cambia **Pedido** a `listo`, de lo contrario *Despachar* se omite.');
});

test('T-074 T-192 unir el par en un subproceso emite el cambio completo y vuelve al mismo texto', () => {
    const x = escindido(), m = must(reanclarExtremo(x.m, { opd: x.hijo, enlace: x.salida, extremo: 'origen', hacia: { cosa: porNombre(x.m, 'Recibir').id } })).modelo;
    const t = estricto(m);
    expect(t).toContain('*Recibir* cambia **Pedido** de `nuevo` a `listo`.'); expect(t).not.toContain('*Despachar* cambia');
});
