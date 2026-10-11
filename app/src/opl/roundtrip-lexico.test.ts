import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace } from '../nucleo/enlaces';
import { renombrarCosa } from '../nucleo/cosas';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarDocumentoOpl, importarOpl } from './documento';

// ISO A.3.2: un carácter de cadena es letra, dígito, «-», «|», «&», «/» o espacio; el estado es una palabra
// no capitalizada y admite los mismos caracteres.
function modelo() {
    const b = modeloCon({ objetos: [['Writing & Signing', ['en curso', 'listo/ok']], ['Main I/O Output', []], ['Entrada|Salida', []]], procesos: ['Check-Based Paying'] });
    const id = (n: string) => porNombre(b, n).id, sd = b.raiz;
    let m = b;
    m = must(crearEnlace(m, { opd: sd, candidato: { tipo: 'efecto', objeto: id('Writing & Signing'), proceso: id('Check-Based Paying'), entrada: estado(m, 'Writing & Signing', 'en curso'), salida: estado(m, 'Writing & Signing', 'listo/ok') } })).modelo;
    m = must(crearEnlace(m, { opd: sd, candidato: { tipo: 'resultado', objeto: id('Main I/O Output'), proceso: id('Check-Based Paying') } })).modelo;
    m = must(crearEnlace(m, { opd: sd, candidato: { tipo: 'etiquetado', origen: id('Entrada|Salida'), destino: id('Main I/O Output'), etiqueta: 'pertenece & usa' } })).modelo;
    return m;
}
function estado(m: ReturnType<typeof modeloCon>, objeto: string, nombre: string): string {
    const o = porNombre(m, objeto); if (o.tipo !== 'objeto') throw Error('Objeto esperado.');
    return o.estados.find(s => s.nombre === nombre)!.id;
}

test('T-025 T-192 nombres con «&», «/», «|» y estados con espacio: OPL desde vacío y códec en punto fijo', () => {
    const m = modelo(), antes = exportarV0(m);
    expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
    const t = generarDocumentoOpl(m);
    for (const s of ['**Writing & Signing**', '**Main I/O Output**', '**Entrada|Salida**', '`en curso`', '`listo/ok`', 'pertenece & usa'])
        expect(t).toContain(s);
    const r = importarOpl(m.nombre, t); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    expect(r.valor.plan.resumen.noAplicables).toBe(0);
    expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);
    const codec = importarV0(antes); expect(codec.ok).toBe(true); if (!codec.ok) throw Error(JSON.stringify(codec.informe));
    expect(codec.informe.normalizado).toEqual([]); expect(exportarV0(codec.modelo)).toBe(antes);
});

test('T-025 renombrar con un carácter fuera de ISO A.3.2 se rechaza; con «/» se admite', () => {
    const m = modelo(), p = porNombre(m, 'Check-Based Paying').id;
    const mal = renombrarCosa(m, { cosa: p, nombre: 'Check?Paying' }); expect(mal.ok).toBe(false);
    expect(must(renombrarCosa(m, { cosa: p, nombre: 'Check/Paying' })).modelo.cosas[p]!.nombre).toBe('Check/Paying');
});
