import { expect, test } from 'bun:test';
import type { EnlaceNuevo, Modelo } from '../nucleo/tipos';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace } from '../nucleo/enlaces';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { generarBloque, textoCanonico } from './generar';

// B-39 (DEC50): los tres etiquetados con estado que el producto rechazaba (ISO §10.4.2.5–§10.4.2.7, Tabla 15).
function base() {
    const b = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']], ['Cliente', ['activo', 'inactivo']]] });
    const p = porNombre(b, 'Pedido'), c = porNombre(b, 'Cliente');
    if (p.tipo !== 'objeto' || c.tipo !== 'objeto') throw Error('Objetos esperados.');
    return { b, p: p.id, c: c.id, listo: p.estados[1]!.id, activo: c.estados[0]!.id };
}
function estricto(m: Modelo): string {
    expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
    for (const opd of Object.keys(m.opds)) expect(planificar(m, opd, textoCanonico(generarBloque(m, opd))).acciones).toEqual([]);
    const t = generarDocumentoOpl(m), r = importarOpl(m.nombre, t); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    expect(r.valor.plan.resumen.noAplicables).toBe(0); expect(Object.keys(r.valor.modelo.enlaces)).toHaveLength(1);
    expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);
    const json = exportarV0(m), codec = importarV0(json); expect(codec.ok).toBe(true); if (!codec.ok) throw Error(JSON.stringify(codec.informe));
    expect(exportarV0(codec.modelo)).toBe(json);
    return t;
}
const casos: readonly (readonly [string, (x: ReturnType<typeof base>) => EnlaceNuevo, readonly string[]])[] = [
    ['bidireccional con estado en destino (SSE4/SSE5)', x => ({ tipo: 'etiquetadoBidireccional', origen: x.p, destino: x.c, etiqueta: 'pertenece a', inversa: 'posee', estadoDestino: x.activo }),
        ['**Pedido** pertenece a **Cliente** en `activo`.', '**Cliente** en `activo` posee **Pedido**.']],
    ['bidireccional con estado en ambos extremos (dos SSE3)', x => ({ tipo: 'etiquetadoBidireccional', origen: x.p, destino: x.c, etiqueta: 'pertenece a', inversa: 'posee', estadoOrigen: x.listo, estadoDestino: x.activo }),
        ['**Pedido** en `listo` pertenece a **Cliente** en `activo`.', '**Cliente** en `activo` posee **Pedido** en `listo`.']],
];
for (const [nombre, candidato, oraciones] of casos)
    test(`T-049 T-192 ${nombre}: OPL canónico desde vacío y códec en punto fijo`, () => {
        const x = base(), r = must(crearEnlace(x.b, { opd: x.b.raiz, candidato: candidato(x) }));
        expect(Object.values(r.modelo.enlaces)).toEqual([{ ...candidato(x), id: r.creados[0]! }]);
        const t = estricto(r.modelo);
        for (const o of oraciones) expect(t).toContain(o);
    });

test('T-049 T-192 recíproco con estado sólo en destino lo lleva al origen (SSE7) con traza', () => {
    const x = base(), candidato = { tipo: 'reciproco', origen: x.p, destino: x.c, etiqueta: 'asociados', estados: { destino: x.activo } } as unknown as EnlaceNuevo;
    const r = crearEnlace(x.b, { opd: x.b.raiz, candidato }); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    expect(Object.values(r.valor.modelo.enlaces)).toEqual([{ id: r.valor.creados[0]!, tipo: 'reciproco', origen: x.c, destino: x.p, etiqueta: 'asociados', estados: { origen: x.activo } }]);
    expect(r.trazas.some(t => t.regla === 'R-EST-SSE-1')).toBe(true);
    expect(estricto(r.valor.modelo)).toContain('**Pedido** y **Cliente** en `activo` son asociados.');
});
