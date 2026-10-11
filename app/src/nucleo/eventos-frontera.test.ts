import { expect, test } from 'bun:test';
import type { Afiliacion, Enlace, EnlaceNuevo, Modelo, Objeto } from './tipos';
import type { Respuesta } from './resultado';
import { congelar, must } from '../pruebas/constructores';
import { validarForma } from './forma';
import { erroresContexto, tiposLegales, violacionesContexto } from './matriz';
import { crearEnlace, fijarControl, reanclarExtremo } from './enlaces';
import { fijarAfiliacion } from './cosas';
import { fijarControlAbanico } from './abanicos';
import { agregarSubprocesos, descomponer } from './refinamiento';
import { diagnosticar, gatesExportacion } from './diagnostico';
import { proyectar } from './proyeccion';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';

// B-44: ISO §14.2.2.4.2 prohíbe que un evento de origen sistémico inicie un subproceso desde
// fuera de cualquiera de sus contornos; el de origen ambiental cruza y el modelador DEBERÍA
// modelar cómo se maneja la contingencia. La propiedad del origen fija qué contornos son exteriores.
function jerarquia(afiliacion: Afiliacion = 'sistemica', enlaces: readonly Enlace[] = []): Modelo {
    const ap = (x: number, y = 80) => ({ x, y, ancho: 135, alto: 60 });
    const objeto = (id: string, nombre: string): Objeto => ({ id, nombre, tipo: 'objeto', esencia: 'fisica', afiliacion,
        estados: [{ id: `${id}-nuevo`, nombre: 'nuevo' }, { id: `${id}-listo`, nombre: 'listo' }] });
    const proceso = (id: string, nombre: string) => ({ id, nombre, tipo: 'proceso' as const, esencia: 'informacional' as const, afiliacion });
    return congelar({ id: 'm-frontera', nombre: 'Eventos', unidadTiempo: 'min', raiz: 'sd', secuencia: 100,
        cosas: { o: objeto('o', 'Pedido'), ip: objeto('ip', 'Registro'), ia: objeto('ia', 'Aviso'),
            p: proceso('p', 'Procesar'), q: proceso('q', 'Solicitar'), a: proceso('a', 'Recibir'), z: proceso('z', 'Despachar'),
            l: proceso('l', 'Inspeccionar'), r: proceso('r', 'Aceptar') },
        enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {},
        opds: {
            sd: { id: 'sd', tipo: 'raiz', apariciones: { o: ap(0), p: ap(250), q: ap(500) } },
            dp: { id: 'dp', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['a'], ['z']], objetosInternos: ['ip'],
                apariciones: { p: { x: 100, y: 0, ancho: 480, alto: 480 }, a: ap(240), z: ap(240, 300), ip: ap(390), o: ap(-100), q: ap(650) } },
            da: { id: 'da', tipo: 'descomposicion', padre: 'dp', cosa: 'a', orden: 0, bandas: [['l'], ['r']], objetosInternos: ['ia'],
                apariciones: { a: { x: 100, y: 0, ancho: 480, alto: 480 }, l: ap(240), r: ap(240, 300), ia: ap(390), ip: ap(-100, 200), o: ap(-100), q: ap(650) } },
        } });
}
function sano(m: Modelo): void { expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]); }
function frontera(m: Modelo, e: Enlace) { return violacionesContexto(m, e).filter(v => v.regla === 'R-CX-DIST-2'); }
function rechazado(r: Respuesta<unknown>, m: Modelo, antes: string): void {
    expect(r.ok).toBe(false);
    if (r.ok) throw Error('El evento externo se aceptó.');
    expect(r.rechazo.regla).toBe('R-CX-DIST-2');
    expect(JSON.stringify(m)).toBe(antes);
    expect(m.secuencia).toBe(100);
}

for (const tipo of ['consumo', 'agente', 'instrumento', 'efecto'] as const)
    for (const proceso of ['a', 'l'])
        test(`T-060 evento ${tipo} sistemica externo no inicia ${proceso}`, () => {
            const m = jerarquia('sistemica'); sano(m);
            const e: Enlace = { id: 'e', tipo, objeto: 'o', proceso, control: 'e' };
            expect(frontera(m, e)).toEqual([expect.objectContaining({ refs: [{ tipo: 'enlace', id: 'e' }] })]);
            rechazado(crearEnlace(m, { opd: proceso === 'a' ? 'dp' : 'da', candidato: { tipo, objeto: 'o', proceso, control: 'e' } }), m, JSON.stringify(m));
        });

for (const tipo of ['consumo', 'agente', 'instrumento', 'efecto'] as const)
    for (const proceso of ['a', 'l'])
        test(`T-060 evento ${tipo} ambiental externo cruza el contorno e inicia ${proceso}`, () => {
            const m = jerarquia('ambiental'); sano(m);
            const e: Enlace = { id: 'e', tipo, objeto: 'o', proceso, control: 'e' };
            expect(frontera(m, e)).toEqual([]);
            const r = crearEnlace(m, { opd: proceso === 'a' ? 'dp' : 'da', candidato: { tipo, objeto: 'o', proceso, control: 'e' } });
            // R-DIST-1 migra el consumo del contorno de Recibir a su primer subproceso.
            const n = must(r).modelo, destino = tipo === 'consumo' && proceso === 'a' ? 'l' : proceso;
            expect(n.enlaces).toEqual({ 'e-100': { id: 'e-100', tipo, objeto: 'o', proceso: destino, control: 'e' } }); sano(n);
        });

for (const afiliacion of ['sistemica', 'ambiental'] as const)
    test(`T-060 pertenecer al abuelo ${afiliacion}: ${afiliacion === 'sistemica' ? 'no cruza' : 'cruza'} el contorno intermedio`, () => {
        const m = jerarquia(afiliacion); sano(m);
        const e: Enlace = { id: 'e', tipo: 'instrumento', objeto: 'ip', proceso: 'l', control: 'e' };
        expect(frontera(m, e)).toHaveLength(afiliacion === 'sistemica' ? 1 : 0);
        const recuperado = jerarquia(afiliacion, [e]); expect(validarForma(recuperado)).toEqual([]);
        expect(gatesExportacion(recuperado, 'modelo').some(d => d.regla === 'R-CX-DIST-2')).toBe(afiliacion === 'sistemica');
        // T-066 impide antes la edición entre internos de OPD distintos. El
        // hecho recuperado sigue necesitando diagnóstico de la frontera real.
        const antes = JSON.stringify(m), r = crearEnlace(m, { opd: 'da', candidato: { tipo: 'instrumento', objeto: 'ip', proceso: 'l', control: 'e' } });
        expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.regla).toBe('T-066'); expect(JSON.stringify(m)).toBe(antes);
    });

for (const afiliacion of ['sistemica', 'ambiental'] as const)
    for (const tipo of ['consumo', 'agente', 'instrumento', 'efecto'] as const)
        test(`T-060 evento interno ${tipo} ${afiliacion} conserva su enlace y control`, () => {
            const m = jerarquia(afiliacion); sano(m);
            const r = must(crearEnlace(m, { opd: 'da', candidato: { tipo, objeto: 'ia', proceso: 'l', control: 'e' } }));
            expect(r.modelo.enlaces[r.creados[0]!]).toEqual({ id: 'e-100', tipo, objeto: 'ia', proceso: 'l', control: 'e' });
            sano(r.modelo);
        });

for (const control of [undefined, 'c'] as const)
    test(`T-060 participación externa ${control ?? 'sin control'} no es un evento`, () => {
        const m = jerarquia(); sano(m);
        const r = must(crearEnlace(m, { opd: 'da', candidato: { tipo: 'instrumento', objeto: 'o', proceso: 'l', ...(control ? { control } : {}) } }));
        expect(r.modelo.enlaces['e-100']).toEqual({ id: 'e-100', tipo: 'instrumento', objeto: 'o', proceso: 'l', ...(control ? { control } : {}) }); sano(r.modelo);
    });

test('T-060 invocación externa es evento; invocación interna y excepción conservan su clase', () => {
    const m = jerarquia(); sano(m);
    const externo: Enlace = { id: 'e', tipo: 'invocacion', origen: 'q', destino: 'l' };
    expect(frontera(m, externo)).toHaveLength(1);
    rechazado(crearEnlace(m, { opd: 'da', candidato: { tipo: 'invocacion', origen: 'q', destino: 'l' } }), m, JSON.stringify(m));
    expect(tiposLegales(m, { opd: 'da', desde: { cosa: 'q' }, hacia: { cosa: 'l' } }).find(o => o.tipo === 'invocacion' && o.sentido === 'directo')).toMatchObject({ legal: false });
    const interno = must(crearEnlace(m, { opd: 'da', candidato: { tipo: 'invocacion', origen: 'r', destino: 'l' } })); sano(interno.modelo);
    for (const tipo of ['excepcionSobretiempo', 'excepcionSubtiempo'] as const)
        expect(frontera(m, { id: 'x', tipo, origen: 'q', destino: 'l' })).toEqual([]);
});

test('T-060 invocación desde un proceso ambiental externo cruza el contorno', () => {
    const m = jerarquia('ambiental'); sano(m);
    expect(frontera(m, { id: 'e', tipo: 'invocacion', origen: 'q', destino: 'l' })).toEqual([]);
    expect(tiposLegales(m, { opd: 'da', desde: { cosa: 'q' }, hacia: { cosa: 'l' } }).find(o => o.tipo === 'invocacion' && o.sentido === 'directo')).toMatchObject({ legal: true });
    const r = must(crearEnlace(m, { opd: 'da', candidato: { tipo: 'invocacion', origen: 'q', destino: 'l' } }));
    expect(r.modelo.enlaces['e-100']).toEqual({ id: 'e-100', tipo: 'invocacion', origen: 'q', destino: 'l' }); sano(r.modelo);
});

test('T-060 cambiar control y reanclar rechazan sin alterar hechos ni secuencia', () => {
    const m = jerarquia('sistemica', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'c' }]); sano(m);
    rechazado(fijarControl(m, { enlace: 'e', control: 'e' }), m, JSON.stringify(m));
    const entero = jerarquia('sistemica', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p', control: 'e' }]); sano(entero);
    rechazado(reanclarExtremo(entero, { opd: 'da', enlace: 'e', extremo: 'destino', hacia: { cosa: 'l' } }), entero, JSON.stringify(entero));
});

test('T-060 cambiar control y reanclar con origen ambiental conservan el evento al subproceso', () => {
    const m = jerarquia('ambiental', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'c' }]); sano(m);
    const control = must(fijarControl(m, { enlace: 'e', control: 'e' })).modelo;
    expect(control.enlaces.e).toEqual({ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'e' }); sano(control);
    const entero = jerarquia('ambiental', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p', control: 'e' }]); sano(entero);
    const reanclado = must(reanclarExtremo(entero, { opd: 'da', enlace: 'e', extremo: 'destino', hacia: { cosa: 'l' } })).modelo;
    expect(reanclado.enlaces.e).toEqual({ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'e' }); sano(reanclado);
});

test('T-060 DS-20 volver sistémico el origen de un evento que cruza se rechaza sin alterar el modelo', () => {
    const m = jerarquia('ambiental', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'e' }]); sano(m);
    rechazado(fijarAfiliacion(m, { cosa: 'o', afiliacion: 'sistemica' }), m, JSON.stringify(m));
    const interno = must(fijarAfiliacion(m, { cosa: 'ia', afiliacion: 'sistemica' })).modelo; sano(interno);
});

test('T-060 DS-20 otro error previo del mismo enlace no encubre el nuevo cruce de evento', () => {
    const b = jerarquia('sistemica', [{ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'l' }]), o = b.cosas.o!;
    if (o.tipo !== 'objeto') throw Error('Fixture sin objeto.');
    const m: Modelo = congelar({ ...b, cosas: { ...b.cosas, o: { ...o, estados: [] } } });
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m).map(v => v.regla)).toEqual(['R-EFE-1']);
    rechazado(fijarControl(m, { enlace: 'e', control: 'e' }), m, JSON.stringify(m));
    expect(fijarControl(m, { enlace: 'e', control: 'c' }).ok).toBe(true);
});

function abanico(afiliacion: Afiliacion, operador: 'XOR' | 'OR'): Modelo {
    const base = jerarquia(afiliacion, [{ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'l' }, { id: 'f', tipo: 'efecto', objeto: 'o', proceso: 'r' }]);
    const da = base.opds.da!; if (da.tipo !== 'descomposicion') throw Error('Fixture sin descomposición.');
    return congelar({ ...base, opds: { ...base.opds, da: { ...da, bandas: [['l', 'r']] } },
        abanicos: { fan: { id: 'fan', operador, enlaces: ['e', 'f'] } } });
}
for (const operador of ['XOR', 'OR'] as const) test(`T-060 control de abanico ${operador} rechaza todas las ramas en una transacción`, () => {
    const m = abanico('sistemica', operador), enlaces = m.enlaces; sano(m);
    rechazado(fijarControlAbanico(m, { abanico: 'fan', control: 'e' }), m, JSON.stringify(m));
    expect(m.abanicos.fan!.operador).toBe(operador); expect(m.enlaces).toBe(enlaces);
});

for (const operador of ['XOR', 'OR'] as const) test(`T-060 control de abanico ${operador} ambiental marca todas las ramas como evento`, () => {
    const m = abanico('ambiental', operador); sano(m);
    const n = must(fijarControlAbanico(m, { abanico: 'fan', control: 'e' })).modelo;
    expect([n.enlaces.e!, n.enlaces.f!].map(e => 'control' in e ? e.control : undefined)).toEqual(['e', 'e']);
    expect(n.abanicos.fan).toEqual(m.abanicos.fan); sano(n);
});

test('T-060 origen sobre el propio contorno conserva la distinción con un origen exterior', () => {
    const m = jerarquia(); sano(m);
    expect(frontera(m, { id: 'e', tipo: 'invocacion', origen: 'a', destino: 'l' })).toEqual([]);
    expect(frontera(m, { id: 'e', tipo: 'invocacion', origen: 'p', destino: 'l' })).toHaveLength(1);
    expect(frontera(m, { id: 'e', tipo: 'invocacion', origen: 'p', destino: 'a' })).toEqual([]);
});

for (const afiliacion of ['sistemica', 'ambiental'] as const)
    for (const tipo of ['agente', 'instrumento', 'efecto'] as const)
        test(`T-073 evento ${tipo} ${afiliacion} inicia el proceso completo y no se propaga a hijos`, () => {
            const m = jerarquia(afiliacion); sano(m);
            const r = must(crearEnlace(m, { opd: 'sd', candidato: { tipo, objeto: 'o', proceso: 'p', control: 'e' } }));
            expect(r.modelo.enlaces).toEqual({ 'e-100': { id: 'e-100', tipo, objeto: 'o', proceso: 'p', control: 'e' } });
            expect(proyectar(r.modelo, 'dp').enlaces.map(v => v.enlace)).toEqual([r.modelo.enlaces['e-100']!]);
            expect(proyectar(r.modelo, 'da').enlaces).toEqual([]); sano(r.modelo);
        });

for (const candidato of [
    { tipo: 'consumo', objeto: 'o', proceso: 'p', control: 'e' },
    { tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-nuevo', control: 'e' },
    { tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-nuevo', salida: 'o-listo', control: 'e' },
] satisfies EnlaceNuevo[])
    test(`T-073 distribución incompatible ${candidato.tipo} ${'salida' in candidato ? 'TS3' : 'entrada'} rechaza descomposición e inserción completas`, () => {
        const j = jerarquia(), { ip, ia, a, z, l, r, ...cosas } = j.cosas;
        const m: Modelo = congelar({ ...j, cosas, opds: { sd: j.opds.sd! }, enlaces: { e: { ...candidato, id: 'e' } } }); sano(m);
        rechazado(descomponer(m, { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] }), m, JSON.stringify(m));
        const vacio = must(descomponer(m, { opd: 'sd', proceso: 'p' })).modelo; sano(vacio);
        const antes = JSON.stringify(vacio), resultado = agregarSubprocesos(vacio, { opd: 'opd-100', bandas: [['Recibir']], posicion: 'final' });
        expect(resultado.ok).toBe(false); if (!resultado.ok) expect(resultado.rechazo.regla).toBe('R-CX-DIST-2');
        expect(JSON.stringify(vacio)).toBe(antes); expect(vacio.secuencia).toBe(101);
    });

for (const candidato of [
    { tipo: 'consumo', objeto: 'o', proceso: 'p', control: 'e' },
    { tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-nuevo', control: 'e' },
    { tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-nuevo', salida: 'o-listo', control: 'e' },
] satisfies EnlaceNuevo[])
    test(`T-073 distribución ${candidato.tipo} ${'salida' in candidato ? 'TS3' : 'entrada'} de evento ambiental migra al primer subproceso con su control`, () => {
        const j = jerarquia('ambiental'), { ip, ia, a, z, l, r, ...cosas } = j.cosas;
        const m: Modelo = congelar({ ...j, cosas, opds: { sd: j.opds.sd! }, enlaces: { e: { ...candidato, id: 'e' } } }); sano(m);
        const d = must(descomponer(m, { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] })).modelo; sano(d);
        expect(d.cosas['p-101']!.nombre).toBe('Recibir');
        expect(d.enlaces).toEqual({ e: { ...candidato, id: 'e', proceso: 'p-101' } });
        const vacio = must(descomponer(m, { opd: 'sd', proceso: 'p' })).modelo; sano(vacio);
        const agregado = must(agregarSubprocesos(vacio, { opd: 'opd-100', bandas: [['Recibir']], posicion: 'final' })).modelo; sano(agregado);
        expect(agregado.enlaces).toEqual({ e: { ...candidato, id: 'e', proceso: 'p-101' } });
    });

test('T-060 códec conserva el evento inválido, muestra el diagnóstico y bloquea export canónico sin reparación automática', () => {
    const m = jerarquia('sistemica', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'e' }]);
    expect(validarForma(m)).toEqual([]);
    const texto = exportarV0(m), r = importarV0(texto);
    expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
    expect(exportarV0(r.modelo)).toBe(texto); expect(r.modelo.enlaces.e).toEqual(m.enlaces.e);
    const ds = diagnosticar(r.modelo).filter(d => d.regla === 'R-CX-DIST-2');
    expect(ds).toEqual([expect.objectContaining({ severidad: 'error', refs: [{ tipo: 'enlace', id: 'e' }] })]);
    expect(ds[0]!.reparacion).toBeUndefined();
    expect(gatesExportacion(r.modelo, 'modelo').some(d => d.regla === 'R-CX-DIST-2')).toBe(true);
    expect(gatesExportacion(r.modelo, { opd: 'da' }).some(d => d.regla === 'R-CX-DIST-2')).toBe(true);
});

test('T-060 códec conserva el evento ambiental que cruza el contorno sin diagnóstico ni bloqueo', () => {
    const m = jerarquia('ambiental', [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'l', control: 'e' }]); sano(m);
    const texto = exportarV0(m), r = importarV0(texto);
    expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.informe));
    expect(exportarV0(r.modelo)).toBe(texto); expect(r.modelo.enlaces.e).toEqual(m.enlaces.e);
    expect(diagnosticar(r.modelo).filter(d => d.regla === 'R-CX-DIST-2')).toEqual([]);
    expect(gatesExportacion(r.modelo, 'modelo')).toEqual([]); expect(gatesExportacion(r.modelo, { opd: 'da' })).toEqual([]);
});
