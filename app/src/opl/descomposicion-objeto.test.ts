import { expect, test } from 'bun:test';
import type { Modelo, OpdDescomposicion } from '../nucleo/tipos';
import { descomponer } from '../nucleo/refinamiento';
import { crearCosa } from '../nucleo/cosas';
import { crearEnlace } from '../nucleo/enlaces';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { generarBloque, textoCanonico } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';
import { modeloCon, must, porNombre } from '../pruebas/constructores';

// B-02: in-zoom de objeto (R-OPL-CX-4, CX13). Las partes llevan orden espacial o lógico; «así como» nombra los
// procesos internos, que son operaciones del objeto (A3.3a).
function pedido(): { m: Modelo; hijo: string } {
    const b = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Procesar Pedido'], enlaces: [['efecto', 'Pedido', 'Procesar Pedido']] });
    const d = must(descomponer(b, { opd: b.raiz, cosa: porNombre(b, 'Pedido').id, bandas: [['Cabecera'], ['Detalle'], ['Pie']] }));
    const hijo = d.creados[0]!;
    const conProceso = must(crearCosa(d.modelo, { opd: hijo, tipo: 'proceso', nombre: 'Validar Detalle', x: 0, y: 0, alcance: 'interno' })).modelo;
    const m = must(crearEnlace(conProceso, { opd: hijo, candidato: { tipo: 'instrumento', objeto: porNombre(conProceso, 'Detalle').id, proceso: porNombre(conProceso, 'Validar Detalle').id } })).modelo;
    return { m, hijo };
}

test('T-072 T-125 B-02 el OPD hijo emite CX13 con las partes en su orden y los procesos internos', () => {
    const { m, hijo } = pedido();
    expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
    const lineas = generarBloque(m, hijo);
    expect(lineas[0]).toMatchObject({ plantilla: 'CX13', texto: '**Pedido** se descompone en **Cabecera**, **Detalle** y **Pie**, en esa secuencia, así como *Validar Detalle*.' });
    expect(generarBloque(m, m.raiz).some(l => l.plantilla.startsWith('CX'))).toBe(false);
    // El proceso interno no se abstrae en el objeto: el SD no muestra su instrumento como un hecho objeto-objeto.
    expect(generarBloque(m, m.raiz).map(l => l.texto)).toEqual(expect.not.arrayContaining([expect.stringContaining('Validar Detalle')]));
});

test('T-191 T-192 B-02 cada OPD se relee sin acciones y el documento se reconstruye idéntico', () => {
    const { m } = pedido(), antes = exportarV0(m);
    for (const opd of Object.keys(m.opds)) {
        const p = planificar(m, opd, textoCanonico(generarBloque(m, opd)));
        expect(p.acciones, opd).toEqual([]); expect(p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error')), opd).toEqual([]);
        const a = aplicarPlan(m, p); expect(a.ok).toBe(true); if (a.ok) expect(a.valor.modelo).toBe(m);
    }
    const t = generarDocumentoOpl(m), r = importarOpl(m.nombre, t);
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.valor.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);
    const d = Object.values(r.valor.modelo.opds).find((o): o is OpdDescomposicion => o.tipo === 'descomposicion')!;
    expect(d.bandas.map(b => b.map(id => r.valor.modelo.cosas[id]!.nombre))).toEqual([['Cabecera'], ['Detalle'], ['Pie']]);
    expect(d.internos.map(id => r.valor.modelo.cosas[id]!.nombre)).toEqual(['Validar Detalle']);
    expect(exportarV0(m)).toBe(antes);
});

test('T-166 B-02 editar CX13 reordena partes y agrega la que falta; no adopta un objeto ajeno', () => {
    const { m, hijo } = pedido();
    const texto = '**Pedido** se descompone en **Pie**, **Cabecera**, **Detalle** y **Firma**, en esa secuencia, así como *Validar Detalle*.';
    const p = planificar(m, hijo, texto); expect(p.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    const a = aplicarPlan(m, p); expect(a.ok).toBe(true); if (!a.ok) return;
    const d = a.valor.modelo.opds[hijo] as OpdDescomposicion;
    expect(d.bandas.map(b => b.map(id => a.valor.modelo.cosas[id]!.nombre))).toEqual([['Pie'], ['Cabecera'], ['Detalle'], ['Firma']]);
    expect(validarForma(a.valor.modelo)).toEqual([]);
    // **Pedido** sigue siendo externo a su propio in-zoom: un objeto que ya existe fuera no se vuelve parte.
    const ajeno = must(crearCosa(m, { opd: m.raiz, tipo: 'objeto', nombre: 'Cliente', x: 400, y: 300 })).modelo;
    const q = planificar(ajeno, hijo, '**Pedido** se descompone en **Cabecera**, **Detalle**, **Pie** y **Cliente**, en esa secuencia, así como *Validar Detalle*.');
    expect(q.lineas[0]!.diagnosticos[0]).toMatchObject({ codigo: 'ambiguous-symbol' });
});

test('T-166 B-02 desde el texto del SD se crea el in-zoom de un objeto con su OPD hijo', () => {
    const r = importarOpl('Pedidos', '# Pedidos\n\n## SD\n*Procesar Pedido* afecta **Pedido**.\n**Pedido** puede estar `nuevo` o `listo`.\n\n## SD1\n**Pedido** se descompone en **Cabecera** y **Detalle**, en esa secuencia.');
    expect(r.ok).toBe(true); if (!r.ok) return;
    const m = r.valor.modelo, d = Object.values(m.opds).find((o): o is OpdDescomposicion => o.tipo === 'descomposicion')!;
    expect(m.cosas[d.cosa]!.nombre).toBe('Pedido'); expect(d.bandas.flat().map(id => m.cosas[id]!.tipo)).toEqual(['objeto', 'objeto']);
    expect(validarForma(m)).toEqual([]); expect(r.valor.plan.resumen.noAplicables).toBe(0);
});
