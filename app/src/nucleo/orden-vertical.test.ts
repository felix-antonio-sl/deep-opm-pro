import { expect, test } from 'bun:test';
import type { Modelo, OpdDescomposicion, Aparicion } from './tipos';
import { alturasContradictorias, TOLERANCIA_ALTURA } from './colocacion';
import { diagnosticar, gatesExportacion, gatesDocumento } from './diagnostico';
import { aplicarAccion, aplicarAcciones } from './operaciones';
import type { Accion } from './operaciones';
import { validarForma } from './forma';
import { modeloCon, must, porNombre, congelar } from '../pruebas/constructores';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { exportarDiagrama } from '../opd/exportar';
import { generarDocumentoOpl } from '../opl/documento';

// B-45, R-INV-2/2A, R-IDP-0A: la altura del punto superior de cada subproceso realiza sus bandas declaradas.
const caja = (y: number): Aparicion => ({ x: 0, y, ancho: 135, alto: 60 });
const opd = (bandas: string[][], ys: Record<string, number>): OpdDescomposicion =>
    ({ id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas, objetosInternos: [], apariciones: Object.fromEntries(Object.entries(ys).map(([id, y]) => [id, caja(y)])) });

test('T-030 B-45 la altura realiza las bandas con la tolerancia admisible y nada más', () => {
    expect(TOLERANCIA_ALTURA).toBe(4);
    expect(alturasContradictorias(opd([['a'], ['b', 'c'], ['d']], { a: 64, b: 164, c: 168, d: 268 }))).toEqual([]);
    // Bandas invertidas: el OPD dibuja b antes que a.
    expect(alturasContradictorias(opd([['a'], ['b']], { a: 200, b: 100 }))).toEqual(['a', 'b']);
    // Una banda paralela dibujada a alturas distintas denota secuencia.
    expect(alturasContradictorias(opd([['a', 'b'], ['c']], { a: 64, b: 69, c: 200 }))).toEqual(['a', 'b']);
    // Bandas sucesivas dentro de la tolerancia se dibujan a la misma altura: paralelo.
    expect(alturasContradictorias(opd([['a'], ['b'], ['c']], { a: 64, b: 68, c: 200 }))).toEqual(['a', 'b']);
    expect(alturasContradictorias(opd([['a'], ['b']], { a: 64, b: 69 }))).toEqual([]);
    expect(alturasContradictorias(opd([], {}))).toEqual([]);
});

function proceso(): Modelo {
    const b = modeloCon({ objetos: [['Pedido', ['recibido', 'despachado']]], procesos: ['Atender'], enlaces: [['efecto', 'Pedido', 'Atender']] });
    return must(aplicarAcciones(b, [{ op: 'descomponer', args: { opd: b.raiz, proceso: porNombre(b, 'Atender').id, bandas: [['Recibir'], ['Revisar', 'Cobrar'], ['Despachar']] } }])).modelo;
}
const hijoDe = (m: Modelo) => Object.values(m.opds).find((o): o is OpdDescomposicion => o.tipo === 'descomposicion')!;
const contradicciones = (m: Modelo) => diagnosticar(m).filter(d => d.codigo === 'orden-vertical-contradictorio');

test('T-030 T-221 B-45 las operaciones de edición conservan la realización de las bandas', () => {
    let m = proceso();
    const h = hijoDe(m), [recibir, revisar, cobrar, despachar] = h.bandas.flat() as [string, string, string, string];
    expect(validarForma(m)).toEqual([]); expect(contradicciones(m)).toEqual([]);
    const pasos: Accion[] = [
        { op: 'moverApariciones', args: { opd: h.id, mover: [{ cosa: revisar, x: 400, y: 900 }] } },
        { op: 'moverApariciones', args: { opd: h.id, mover: [{ cosa: h.cosa, x: 300, y: -200 }] } },
        { op: 'redimensionar', args: { opd: h.id, cosa: recibir, ancho: 200, alto: 140 } },
        { op: 'moverSubproceso', args: { opd: h.id, proceso: despachar, destino: { nuevaBandaAntesDe: 0 } } },
        { op: 'fijarBandas', args: { opd: h.id, bandas: [[recibir, revisar], [cobrar], [despachar]] } },
        { op: 'agregarSubprocesos', args: { opd: h.id, bandas: [['Archivar']], posicion: 'final' } },
        { op: 'eliminarCosas', args: { cosas: [cobrar] } },
    ];
    for (const a of pasos) {
        m = must(aplicarAccion(m, a)).modelo;
        expect(alturasContradictorias(hijoDe(m)), a.op).toEqual([]); expect(contradicciones(m)).toEqual([]);
    }
    // Arrastrar un subproceso no cambia su altura: el orden sólo cambia con su operación de bandas.
    const antes = hijoDe(m).apariciones[revisar]!.y;
    expect(hijoDe(must(aplicarAccion(m, pasos[0]!)).modelo).apariciones[revisar]!.y).toBe(antes);
});

function contradictorio() {
    const m = proceso(), h = hijoDe(m), [recibir, , , despachar] = h.bandas.flat() as [string, string, string, string];
    const v0 = JSON.parse(exportarV0(m)), apariencias = v0.modelo.opds[h.id].apariencias as Record<string, { entidadId: string; y: number }>;
    const a = Object.values(apariencias).find(x => x.entidadId === recibir)!, z = Object.values(apariencias).find(x => x.entidadId === despachar)!;
    [a.y, z.y] = [z.y, a.y];
    return { original: m, h, recibir, despachar, texto: JSON.stringify(v0, null, 2) + '\n' };
}

test('T-030 B-45 importar v0 conserva datos y bandas sin recolocar y diagnostica la contradicción', () => {
    const { original, h, recibir, despachar, texto } = contradictorio();
    const r = importarV0(texto); expect(r.ok).toBe(true); if (!r.ok) throw Error('Importación');
    const m = r.modelo, hijo = hijoDe(m);
    expect(r.informe.descartado).toEqual([]); expect(r.informe.normalizado).toEqual([]); expect(r.informe.rechazos).toEqual([]);
    expect(hijo.bandas).toEqual(h.bandas);
    expect(hijo.apariciones[recibir]!.y).toBe(h.apariciones[despachar]!.y);
    expect(hijo.apariciones[despachar]!.y).toBe(h.apariciones[recibir]!.y);
    expect(exportarV0(m)).toBe(texto);
    // El OPL sigue las bandas declaradas: no se reordena por la altura incidental.
    expect(generarDocumentoOpl(m)).toBe(generarDocumentoOpl(original));
    expect(contradicciones(m)).toEqual([expect.objectContaining({ severidad: 'error', regla: 'R-INV-2/2A, R-IDP-0A', opd: hijo.id,
        refs: [{ tipo: 'opd', id: hijo.id }, ...hijo.bandas.flat().map(id => ({ tipo: 'cosa', id }))],
        reparacion: { op: 'fijarBandas', args: { opd: hijo.id, bandas: hijo.bandas } } })]);
});

test('T-030 T-283 B-45 la contradicción bloquea los exports canónicos y la reparación explícita los libera', () => {
    const { original, texto } = contradictorio(), r = importarV0(texto); if (!r.ok) throw Error('Importación');
    const m = congelar(r.modelo), hijo = hijoDe(m), antes = JSON.stringify(m);
    expect(gatesExportacion(m, { opd: hijo.id })).toEqual([expect.objectContaining({ codigo: 'contexto', regla: 'R-INV-2/2A, R-IDP-0A' })]);
    expect(gatesExportacion(m, { opd: m.raiz })).toEqual([]);
    expect(gatesDocumento(m).map(g => g.regla)).toContain('R-INV-2/2A, R-IDP-0A');
    const diagrama = exportarDiagrama(m, hijo.id, { version: 'b45' });
    expect(diagrama.ok).toBe(false);
    expect(exportarDiagrama(m, m.raiz, { version: 'b45' }).ok).toBe(true);
    const reparado = must(aplicarAccion(m, contradicciones(m)[0]!.reparacion!)).modelo;
    expect(JSON.stringify(m)).toBe(antes);
    expect(hijoDe(reparado).bandas).toEqual(hijo.bandas);
    expect(alturasContradictorias(hijoDe(reparado))).toEqual([]); expect(contradicciones(reparado)).toEqual([]);
    expect(Object.keys(reparado.cosas)).toEqual(Object.keys(m.cosas)); expect(reparado.enlaces).toEqual(m.enlaces);
    expect(generarDocumentoOpl(reparado)).toBe(generarDocumentoOpl(original));
    expect(gatesExportacion(reparado, { opd: hijo.id })).toEqual([]); expect(gatesDocumento(reparado)).toEqual([]);
    expect(exportarDiagrama(reparado, hijo.id, { version: 'b45' }).ok).toBe(true);
    const json = importarV0(exportarV0(reparado)); expect(json.ok).toBe(true);
    if (json.ok) expect(exportarV0(json.modelo)).toBe(exportarV0(reparado));
});

test('T-030 B-45 v0 sin orden declarado deriva bandas con la misma tolerancia y diagnostica la ambigüedad', () => {
    const m = proceso(), h = hijoDe(m), v0 = JSON.parse(exportarV0(m));
    delete v0.modelo.opds[h.id].ordenInzoom;
    const apariencias = Object.values(v0.modelo.opds[h.id].apariencias as Record<string, { entidadId: string; y: number }>);
    const [recibir, revisar, cobrar, despachar] = h.bandas.flat() as [string, string, string, string];
    const fijar = (ys: Record<string, number>) => { for (const a of apariencias) if (a.entidadId in ys) a.y = ys[a.entidadId]!; return importarV0(JSON.stringify(v0)); };
    const tolerado = fijar({ [recibir]: 100, [revisar]: 200, [cobrar]: 203, [despachar]: 300 });
    if (!tolerado.ok) throw Error('Importación');
    expect(hijoDe(tolerado.modelo).bandas).toEqual([[recibir], [revisar, cobrar], [despachar]]);
    expect(contradicciones(tolerado.modelo)).toEqual([]);
    // Alturas encadenadas dentro de la tolerancia no tienen una lectura única: se cargan y se diagnostican.
    const ambiguo = fijar({ [recibir]: 100, [revisar]: 200, [cobrar]: 204, [despachar]: 205 });
    if (!ambiguo.ok) throw Error('Importación');
    expect(hijoDe(ambiguo.modelo).bandas).toEqual([[recibir], [revisar, cobrar], [despachar]]);
    expect(contradicciones(ambiguo.modelo).map(d => d.refs.slice(1).map(r => r.id))).toEqual([[revisar, cobrar, despachar]]);
});
