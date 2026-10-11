import { expect, test } from 'bun:test';
import type { EnlaceNuevo, Id, Modelo } from '../nucleo/tipos';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { descomponer } from '../nucleo/refinamiento';
import { fijarAfiliacion, traerCosa } from '../nucleo/cosas';
import { crearEnlace, fijarControl } from '../nucleo/enlaces';
import { validarForma } from '../nucleo/forma';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';

// El padre muestra abstraído al contenedor el hecho de un subproceso; leer el documento desde vacío
// no debe convertir esa proyección en un segundo enlace del contorno.
interface Montaje { m: Modelo; opd: Id; id: (nombre: string) => Id; }
// Un nivel: Procesar → Inspeccionar, Aceptar. Dos niveles: además Inspeccionar → Revisar, Firmar.
function montaje(niveles: 1 | 2 = 1): Montaje {
    const b = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']], ['Informe', []]], procesos: ['Procesar'] });
    const d = must(descomponer(b, { opd: b.raiz, proceso: porNombre(b, 'Procesar').id, bandas: [['Inspeccionar'], ['Aceptar']] }));
    let m = d.modelo;
    const opds = [d.creados[0]!];
    if (niveles === 2) {
        const n = must(descomponer(m, { opd: opds[0]!, proceso: porNombre(m, 'Inspeccionar').id, bandas: [['Revisar'], ['Firmar']] }));
        m = n.modelo; opds.push(n.creados[0]!);
    }
    for (const opd of opds) for (const nombre of ['Pedido', 'Informe'])
        m = must(traerCosa(m, { opd, cosa: porNombre(m, nombre).id, x: -220, y: 70 })).modelo;
    return { m, opd: opds.at(-1)!, id: nombre => porNombre(m, nombre).id };
}
const casos: readonly (readonly [string, 1 | 2, (id: Montaje['id']) => EnlaceNuevo])[] = [
    ['instrumento con condición al primer subproceso', 1, id => ({ tipo: 'instrumento', objeto: id('Pedido'), proceso: id('Inspeccionar'), control: 'c' })],
    ['instrumento al último subproceso', 1, id => ({ tipo: 'instrumento', objeto: id('Pedido'), proceso: id('Aceptar') })],
    ['agente al último subproceso', 1, id => ({ tipo: 'agente', objeto: id('Pedido'), proceso: id('Aceptar') })],
    ['efecto del último subproceso', 1, id => ({ tipo: 'efecto', objeto: id('Pedido'), proceso: id('Aceptar') })],
    ['consumo del último subproceso', 1, id => ({ tipo: 'consumo', objeto: id('Pedido'), proceso: id('Aceptar') })],
    ['resultado del primer subproceso', 1, id => ({ tipo: 'resultado', objeto: id('Informe'), proceso: id('Inspeccionar') })],
    ['instrumento con condición dos niveles abajo', 2, id => ({ tipo: 'instrumento', objeto: id('Pedido'), proceso: id('Firmar'), control: 'c' })],
    ['resultado dos niveles abajo', 2, id => ({ tipo: 'resultado', objeto: id('Informe'), proceso: id('Revisar') })],
];

for (const [nombre, nivel, candidato] of casos)
    test(`T-192 T-085 documento desde vacío no duplica en el contorno el ${nombre}`, () => {
        const x = montaje(nivel), r = must(crearEnlace(x.m, { opd: x.opd, candidato: candidato(x.id) })), m = r.modelo;
        expect(r.modelo.enlaces[r.creados[0]!]).toEqual({ ...candidato(x.id), id: r.creados[0]! });
        expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
        const antes = exportarV0(m), t = generarDocumentoOpl(m), a = importarOpl(m.nombre, t);
        expect(a.ok).toBe(true); if (!a.ok) throw Error(a.rechazo.mensaje);
        expect(a.valor.plan.resumen.noAplicables).toBe(0);
        expect(Object.keys(a.valor.modelo.enlaces)).toHaveLength(1);
        expect(generarDocumentoOpl(a.valor.modelo)).toBe(t);
        expect(exportarV0(m)).toBe(antes);
    });

test('T-192 T-060 documento desde vacío conserva un único evento ambiental que cruza el contorno', () => {
    const x = montaje(); let m = x.m;
    m = must(fijarAfiliacion(m, { cosa: x.id('Pedido'), afiliacion: 'ambiental' })).modelo;
    m = must(crearEnlace(m, { opd: x.opd, candidato: { tipo: 'instrumento', objeto: x.id('Pedido'), proceso: x.id('Inspeccionar'), control: 'e' } })).modelo;
    expect(validarForma(m)).toEqual([]); expect(gatesExportacion(m, 'modelo')).toEqual([]);
    const t = generarDocumentoOpl(m), a = importarOpl(m.nombre, t);
    expect(a.ok).toBe(true); if (!a.ok) throw Error(a.rechazo.mensaje);
    expect(Object.values(a.valor.modelo.enlaces)).toEqual([expect.objectContaining({ tipo: 'instrumento', proceso: porNombre(a.valor.modelo, 'Inspeccionar').id, control: 'e' })]);
    expect(generarDocumentoOpl(a.valor.modelo)).toBe(t);
});

test('T-172 T-174 la oración del padre que repite la proyección de la base no edita: manda la edición del hijo', () => {
    const x = montaje();
    const r = must(crearEnlace(x.m, { opd: x.opd, candidato: { tipo: 'instrumento', objeto: x.id('Pedido'), proceso: x.id('Inspeccionar'), control: 'c' } }));
    const m = r.modelo, enlace = r.creados[0]!, t = generarDocumentoOpl(m);
    const padre = '*Procesar* ocurre si **Pedido** existe, de lo contrario *Procesar* se omite.';
    const hijo = '*Inspeccionar* ocurre si **Pedido** existe, de lo contrario *Inspeccionar* se omite.';
    expect(t).toContain(padre); expect(t).toContain(hijo);
    const editado = t.replace(hijo, '*Inspeccionar* requiere **Pedido**.'), p = planificar(m, 'modelo', editado);
    expect(p.resumen.noAplicables).toBe(0);
    expect(p.lineas.find(l => l.texto === padre)).toMatchObject({ estado: 'sin-cambio', patches: [] });
    const n = must(aplicarPlan(m, p)).modelo;
    expect(n.enlaces).toEqual({ [enlace]: { id: enlace, tipo: 'instrumento', objeto: x.id('Pedido'), proceso: x.id('Inspeccionar') } });
    expect(generarDocumentoOpl(n)).toBe(generarDocumentoOpl(must(fijarControl(m, { enlace, control: null })).modelo));
});
