import { expect, test } from 'bun:test';
import { esProcedimental } from './tipos';
import type { Enlace, Modelo, OpdDescomposicion, Objeto } from './tipos';
import { descomponer, agregarSubprocesos, moverSubproceso, fijarBandas, desplegar, agregarRefinadores, eliminarRefinamiento } from './refinamiento';
import { crearEnlace, distribuirEnlace, cambiarTipoEnlace } from './enlaces';
import { crearCosa, traerCosa } from './cosas';
import { validarForma } from './forma';
import { erroresContexto, tiposLegales } from './matriz';
import { congelar, must } from '../pruebas/constructores';
import { indice } from './indice';
import { proyectar } from './proyeccion';
import { diagnosticar, gatesExportacion } from './diagnostico';

// Literales manuales de DESIGN4.5 y CANON3; no derivados de la tabla ejecutable.
function base(e?: Enlace): Modelo {
    const app = (x: number, y = 0) => ({ x, y, ancho: 135, alto: 60 });
    return congelar({ id: 'm', nombre: 'Refinar', raiz: 'sd', secuencia: 100, unidadTiempo: 'min',
        cosas: { o: { id: 'o', tipo: 'objeto', nombre: 'Pedido', esencia: 'fisica', afiliacion: 'sistemica', estados: [{ id: 's0', nombre: 'nuevo' }, { id: 's1', nombre: 'listo' }, { id: 's2', nombre: 'entregado' }] }, b: { id: 'b', tipo: 'objeto', nombre: 'Caja', esencia: 'fisica', afiliacion: 'sistemica', estados: [] }, p: { id: 'p', tipo: 'proceso', nombre: 'Procesar', esencia: 'informacional', afiliacion: 'sistemica' }, q: { id: 'q', tipo: 'proceso', nombre: 'Notificar', esencia: 'informacional', afiliacion: 'sistemica' } },
        enlaces: e ? { [e.id]: e } : {}, abanicos: {}, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { o: app(0), p: app(250), b: app(500), q: app(750) } } } });
}
function refinado(n: 0 | 1 | 3, e: Enlace): Modelo {
    const m = base(e), ids = ['a', 'z', 'c'].slice(0, n), procesos = Object.fromEntries(ids.map((id, i) => [id, { id, tipo: 'proceso' as const, nombre: ['Recibir', 'Validar', 'Despachar'][i]!, esencia: 'informacional' as const, afiliacion: 'sistemica' as const }]));
    const dc: OpdDescomposicion = { id: 'dc', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: ids.map(id => [id]), objetosInternos: [], apariciones: { p: { x: 0, y: 0, ancho: 420, alto: 500 }, o: { x: -220, y: 70, ancho: 135, alto: 60 }, b: { x: -220, y: 170, ancho: 135, alto: 60 }, q: { x: 550, y: 170, ancho: 135, alto: 60 }, ...Object.fromEntries(ids.map((id, i) => [id, { x: 140, y: 64 + 100 * i, ancho: 135, alto: 60 }])) } };
    return congelar({ ...m, cosas: { ...m.cosas, ...procesos }, opds: { ...m.opds, dc } });
}
function conProceso(e: Enlace, proceso: string): Enlace { if (!esProcedimental(e)) throw Error('Se esperaba enlace procedimental del fixture.'); return { ...e, proceso }; }
function sano(m: Modelo) { expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]); }
test('T-070 descomponer copia todos los conectados sin semillas y conserva entrada', () => {
    const m = base({ id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' }), antes = JSON.stringify(m); sano(m);
    const r = must(descomponer(m, { opd: 'sd', proceso: 'p' })), dc = r.modelo.opds[r.creados[0]!]!;
    expect(dc).toMatchObject({ tipo: 'descomposicion', padre: 'sd', cosa: 'p', bandas: [], objetosInternos: [] });
    expect(Object.keys(dc.apariciones).sort()).toEqual(['o', 'p']); expect(dc.apariciones.p!.ancho).toBeGreaterThan(135);
    expect(r.creados).toEqual(['opd-100']); expect(r.modelo.cosas).toBe(m.cosas); expect(r.modelo.enlaces).toBe(m.enlaces); sano(r.modelo); expect(JSON.stringify(m)).toBe(antes);
});
test('T-070 T-075 descomponer bandas en un resultado atómico migra C primero R último', () => {
    const m0 = base({ id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' }), m: Modelo = congelar({ ...m0, enlaces: { ...m0.enlaces, r: { id: 'r', tipo: 'resultado', objeto: 'b', proceso: 'p' } } });
    const r = must(descomponer(m, { opd: 'sd', proceso: 'p', bandas: [['Recibir', 'Revisar'], ['Despachar']] }));
    const dc = r.modelo.opds['opd-100']! as OpdDescomposicion;
    expect(dc.bandas).toEqual([['p-101', 'p-102'], ['p-103']]); expect(r.modelo.enlaces.e).toMatchObject({ id: 'e', proceso: 'p-101' }); expect(r.modelo.enlaces.r).toMatchObject({ id: 'r', proceso: 'p-103' }); sano(r.modelo);
});
for (const [proceso, want] of [['o', 'descomposicion-objeto'], ['ausente', 'no-encontrado']] as const)
    test(`T-070 rechaza ${want} sin reservar ID`, () => { const m = base(), antes = JSON.stringify(m), r = descomponer(m, { opd: 'sd', proceso }); expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe(want); expect(JSON.stringify(m)).toBe(antes); });
test('T-078 T-079 rechaza ciclo contenedor y externo; refinado existente', () => {
    const m = refinado(1, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' });
    for (const [opd, proceso, codigo] of [['dc', 'p', 'ciclo'], ['dc', 'q', 'externo-no-refinable'], ['sd', 'p', 'ya-refinado']] as const) {
        const r = descomponer(m, { opd, proceso }); expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe(codigo);
    }
});
const filas: readonly [string, Enlace, 'primero' | 'ultimo' | 'escision' | 'contorno'][] = [
    ['consumo', { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' }, 'primero'],
    ['consumo estado', { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's0' }, 'primero'],
    ['resultado', { id: 'e', tipo: 'resultado', objeto: 'o', proceso: 'p' }, 'ultimo'],
    ['resultado estado', { id: 'e', tipo: 'resultado', objeto: 'o', proceso: 'p', estado: 's1' }, 'ultimo'],
    ['TS3', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' }, 'escision'],
    ['TS3 c DS4', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1', control: 'c' }, 'primero'],
    ['TS3 e DS4', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1', control: 'e' }, 'primero'],
    ['TS4', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0' }, 'primero'],
    ['TS5', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', salida: 's1' }, 'ultimo'],
    ['T3', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p' }, 'contorno'],
    ['agente', { id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p' }, 'contorno'],
    ['instrumento', { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' }, 'contorno'],
    ['agente e sistémico', { id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p', control: 'e' }, 'primero'],
    ['instrumento e sistémico', { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p', control: 'e' }, 'primero'],
    ['T3 e sistémico', { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', control: 'e' }, 'primero'],
    ['invocación', { id: 'e', tipo: 'invocacion', origen: 'p', destino: 'q' }, 'contorno'],
    ['excepción', { id: 'e', tipo: 'excepcionSobretiempo', origen: 'p', destino: 'q' }, 'contorno'],
    ['estructural', { id: 'e', tipo: 'agregacion', refinable: 'p', refinador: 'q' }, 'contorno'],
    ['etiquetado', { id: 'e', tipo: 'etiquetado', origen: 'p', destino: 'q', etiqueta: 'notifica' }, 'contorno'],
];
for (const [nombre, e, destino] of filas) for (const n of [0, 1, 3] as const)
    test(`T-074 T-075 T-076 distribución ${nombre} con ${n} subprocesos`, () => {
        const m = refinado(n, e), antes = JSON.stringify(m); expect(validarForma(m)).toEqual([]);
        const r = must(distribuirEnlace(m, { enlace: 'e' })), out = r.modelo.enlaces.e!;
        const want = n === 0 || destino === 'contorno' ? 'p' : destino === 'ultimo' && n === 3 ? 'c' : 'a';
        expect('proceso' in out ? out.proceso : out).toEqual('proceso' in e ? want : e);
        if (n === 3 && destino === 'escision') {
            expect(out).toEqual({ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', escision: { par: 'e-100', mitad: 'entrada' } });
            expect(r.modelo.enlaces['e-100']).toEqual({ id: 'e-100', tipo: 'efecto', objeto: 'o', proceso: 'c', salida: 's1', escision: { par: 'e', mitad: 'salida' } }); expect(r.creados).toEqual(['e-100']);
        } else { expect(Object.keys(r.modelo.enlaces)).toEqual(['e']); expect(r.creados).toEqual([]); }
        sano(r.modelo); expect(JSON.stringify(m)).toBe(antes);
    });
test('T-076 primera inserción de todos los nombres distribuye una vez, posteriores no migran', () => {
    const m = refinado(0, { id: 'e', tipo: 'resultado', objeto: 'o', proceso: 'p' });
    const a = must(agregarSubprocesos(m, { opd: 'dc', bandas: [['Recibir'], ['Despachar']], posicion: 'final' }));
    expect(a.modelo.enlaces.e).toMatchObject({ proceso: 'p-101' });
    const b = must(agregarSubprocesos(a.modelo, { opd: 'dc', bandas: [['Archivar']], posicion: 'final' }));
    expect(b.modelo.enlaces.e).toEqual(a.modelo.enlaces.e); sano(b.modelo);
});
test('T-076 hook crearCosa interno activa distribución y hereda afiliación', () => {
    const a = refinado(0, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' }), m: Modelo = congelar({ ...a, cosas: { ...a.cosas, p: { ...a.cosas.p!, afiliacion: 'ambiental' } } });
    const r = must(crearCosa(m, { opd: 'dc', tipo: 'proceso', nombre: 'Recibir', x: 120, y: 80, alcance: 'interno' }));
    expect(r.modelo.enlaces.e).toMatchObject({ proceso: 'p-100' }); expect(r.modelo.cosas['p-100']!.afiliacion).toBe('ambiental'); sano(r.modelo);
});
test('T-075 enlace tardío recursivo conserva ID y externos de cada nivel', () => {
    const m = refinado(3, { id: 'e', tipo: 'instrumento', objeto: 'b', proceso: 'p' });
    const a = must(descomponer(m, { opd: 'dc', proceso: 'a', bandas: [['Inspeccionar'], ['Aceptar']] })).modelo;
    const r = must(crearEnlace(a, { opd: 'sd', candidato: { tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's0' } }));
    const id = r.creados[0]!; expect(r.modelo.enlaces[id]).toMatchObject({ id, proceso: 'p-101', estado: 's0' });
    expect(r.modelo.opds.dc!.apariciones.o).toBeDefined(); expect(r.modelo.opds['opd-100']!.apariciones.o).toBeDefined(); sano(r.modelo);
});
for (const modo of ['agregacion', 'exhibicion', 'generalizacion', 'clasificacion'] as const)
    test(`T-071 despliegue ${modo} copia sólo hijos directos del modo y agrega refinadores`, () => {
        const a = base(), m: Modelo = congelar({ ...a, cosas: { ...a.cosas, t: { id: 't', tipo: 'objeto', nombre: 'Archivo', esencia: 'informacional', afiliacion: 'sistemica', estados: [] } }, enlaces: { k: { id: 'k', tipo: modo, refinable: 'o', refinador: 'b' }, distinto: { id: 'distinto', tipo: modo === 'exhibicion' ? 'agregacion' : 'exhibicion', refinable: 'o', refinador: 't' } }, opds: { sd: { ...a.opds.sd!, apariciones: { ...a.opds.sd!.apariciones, t: { x: 850, y: 0, ancho: 135, alto: 60 } } } } });
        sano(m);
        const r = must(desplegar(m, { opd: 'sd', cosa: 'o', modo }));
        expect(Object.keys(r.modelo.opds['opd-100']!.apariciones).sort()).toEqual(['b', 'o']);
        const nuevo = must(agregarRefinadores(r.modelo, { opd: 'opd-100', nombres: ['Documento'] }));
        expect(nuevo.modelo.cosas['o-101']!.tipo).toBe('objeto'); expect(nuevo.modelo.enlaces['e-102']).toMatchObject({ tipo: modo, refinable: 'o', refinador: 'o-101' }); sano(nuevo.modelo);
    });
test('T-083 T-080 DS16 eliminar hoja materializa TS3 y conserva externos', () => {
    const a = base({ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' }), r = must(descomponer(a, { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] }));
    const out = must(eliminarRefinamiento(r.modelo, { opd: 'opd-100' })).modelo;
    expect(Object.keys(out.opds)).toEqual(['sd']); expect(Object.keys(out.cosas).sort()).toEqual(['b', 'o', 'p', 'q']); expect(out.enlaces.e).toEqual(a.enlaces.e); expect(Object.keys(out.enlaces)).toEqual(['e']); sano(out);
});
test('T-082 fijarBandas acepta partición completa, realiza Y y conserva enlaces', () => {
    const m = refinado(3, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' });
    const r = must(fijarBandas(m, { opd: 'dc', bandas: [['c', 'a'], ['z']] })).modelo, dc = r.opds.dc! as OpdDescomposicion;
    expect(dc.bandas).toEqual([['c', 'a'], ['z']]); expect(dc.apariciones.c!.y).toBe(dc.apariciones.a!.y); expect(dc.apariciones.z!.y).toBeGreaterThan(dc.apariciones.a!.y); expect(r.enlaces).toBe(m.enlaces); sano(r);
    for (const bandas of [[['a']], [['a', 'z', 'c', 'c']], [[], ['a', 'z', 'c']]]) {
        const mal = fijarBandas(m, { opd: 'dc', bandas }); expect(mal.ok).toBe(false); if (!mal.ok) expect(mal.rechazo.codigo).toBe('forma');
    }
});
for (const regla of ['AP-27', 'R-INV-2B'] as const)
    test(`T-082 T-269 moverSubproceso permite ${regla} recuperable; fijarBandas normal rechaza`, () => {
        const inicial = refinado(3, { id: 'e', tipo: 'agente', objeto: 'o', proceso: 'a', control: 'e' });
        const m: Modelo = regla === 'AP-27' ? congelar({ ...inicial, enlaces: { ...inicial.enlaces, r: { id: 'r', tipo: 'consumo', objeto: 'b', proceso: 'z' } } }) : congelar({ ...inicial, enlaces: { e: { id: 'e', tipo: 'invocacion', origen: 'a', destino: 'c' } } });
        const proceso = regla === 'AP-27' ? 'a' : 'c', banda = regla === 'AP-27' ? 2 : 1;
        const particion = regla === 'AP-27' ? [['z'], ['c', 'a']] : [['a'], ['z', 'c']];
        sano(m); const antes = JSON.stringify(m);
        const normal = fijarBandas(m, { opd: 'dc', bandas: particion }); expect(normal.ok).toBe(false); if (!normal.ok) expect(normal.rechazo.codigo).toBe('contexto');
        const movido = must(moverSubproceso(m, { opd: 'dc', proceso, destino: { banda } })).modelo;
        expect((movido.opds.dc! as OpdDescomposicion).bandas).toEqual(particion); expect(movido.enlaces).toBe(m.enlaces); expect(erroresContexto(movido).some(v => v.regla === regla)).toBe(true); expect(validarForma(movido)).toEqual([]); expect(JSON.stringify(m)).toBe(antes);
    });
test('T-082 mover a nueva banda elimina la vacía y nunca migra', () => {
    const m = refinado(3, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'a' });
    const r = must(moverSubproceso(m, { opd: 'dc', proceso: 'a', destino: { nuevaBandaAntesDe: 3 } })).modelo;
    expect((r.opds.dc! as OpdDescomposicion).bandas).toEqual([['z'], ['c'], ['a']]); expect(r.enlaces).toBe(m.enlaces); sano(r);
});
test('T-074 DS4 abanico TS3 migra entero con operador y IDs en todas las ramas', () => {
    const a = refinado(3, { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' }), m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, f2: { id: 'f2', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's2' } }, abanicos: { fan: { id: 'fan', operador: 'OR', enlaces: ['e', 'f2'] } } });
    expect(validarForma(m)).toEqual([]); const r = must(distribuirEnlace(m, { enlace: 'e' }));
    expect(Object.keys(r.modelo.enlaces)).toEqual(['e', 'f2']); expect(r.modelo.enlaces.e).toMatchObject({ id: 'e', proceso: 'a', entrada: 's0', salida: 's1' }); expect(r.modelo.enlaces.f2).toMatchObject({ id: 'f2', proceso: 'a', entrada: 's0', salida: 's2' }); expect(r.modelo.abanicos).toEqual(m.abanicos); expect(r.creados).toEqual([]); sano(r.modelo);
});
test('T-076 evento ambiental conserva contorno y TS4 c standalone migra sin escisión', () => {
    const a = refinado(3, { id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p', control: 'e' }), ambiental: Modelo = congelar({ ...a, cosas: { ...a.cosas, o: { ...a.cosas.o!, afiliacion: 'ambiental' } } });
    const r = must(distribuirEnlace(ambiental, { enlace: 'e' })); expect(r.modelo.enlaces.e).toEqual(ambiental.enlaces.e); sano(r.modelo);
    const t = must(distribuirEnlace(refinado(3, { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', control: 'c' }), { enlace: 'e' })); expect(t.modelo.enlaces.e).toEqual({ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', control: 'c' }); sano(t.modelo);
});
test('T-075 DS20 colisión FINAL rechaza creación tardía, no muta ni reserva ID', () => {
    const m = refinado(3, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'a' }), antes = JSON.stringify(m);
    const r = crearEnlace(m, { opd: 'sd', candidato: { tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's0' } }); expect(r.ok).toBe(false); expect(JSON.stringify(m)).toBe(antes);
    const menu = tiposLegales(m, { opd: 'sd', desde: { cosa: 'o', estado: 's0' }, hacia: { cosa: 'p' } }); expect(menu.find(o => o.tipo === 'consumo' && o.sentido === 'directo')!.legal).toBe(false);
});
test('T-076 nombres ambiguos y léxico inválido rechazan inserción atómica completa', () => {
    const m = refinado(0, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' }), antes = JSON.stringify(m);
    for (const [bandas, codigo] of [[[['Recibir'], ['Pedido']], 'referencia-ambigua'], [[['Recibir'], ['incorrecto']], 'lexico']] as const) {
        const r = agregarSubprocesos(m, { opd: 'dc', bandas, posicion: 'final' }); expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe(codigo); expect(JSON.stringify(m)).toBe(antes);
    }
});
test('T-083 rechaza no hoja; al eliminar hermano renumera orden sin alterar IDs', () => {
    const a = must(descomponer(base(), { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] })).modelo;
    const hijo = must(descomponer(a, { opd: 'opd-100', proceso: 'p-101' })).modelo;
    const no = eliminarRefinamiento(hijo, { opd: 'opd-100' }); expect(no.ok).toBe(false); if (!no.ok) expect(no.rechazo.codigo).toBe('refinamiento-no-hoja');
    const hermano = must(descomponer(a, { opd: 'sd', proceso: 'q' })).modelo, qid = indice(hermano).refinamientosDe.get('q')!.descomposicion!;
    const r = must(eliminarRefinamiento(hermano, { opd: 'opd-100' })).modelo; expect(r.opds[qid]).toMatchObject({ id: qid, orden: 0 }); expect(indice(r).etiqueta.get(qid)).toBe('SD1'); sano(r);
});
test('T-020 ensayo compartido no rechaza borrador anterior al retiro final del valor huérfano', () => {
    const a = base({ id: 'e', tipo: 'exhibicion', refinable: 'o', refinador: 'b' }), m: Modelo = congelar({ ...a, cosas: { ...a.cosas, b: { ...a.cosas.b! as Objeto, valor: 'uno' } } });
    sano(m); const r = must(cambiarTipoEnlace(m, { enlace: 'e', tipo: 'agregacion' })).modelo; expect(r.cosas.b).not.toHaveProperty('valor'); expect(r.enlaces.e).toEqual({ id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'b' }); sano(r);
});
test('T-077 operaciones permiten placeholder vacío y uno, gate real exige dos', () => {
    const m = base(), vacio = must(descomponer(m, { opd: 'sd', proceso: 'p' })).modelo;
    for (const actual of [vacio, must(agregarSubprocesos(vacio, { opd: 'opd-100', bandas: [['Recibir']], posicion: 'final' })).modelo]) {
        expect(diagnosticar(actual).some(d => d.codigo === 'refinamiento-trivial' && d.opd === 'opd-100')).toBe(true); expect(gatesExportacion(actual, { opd: 'opd-100' }).some(d => d.regla.includes('R-REF-NTRIV'))).toBe(true);
    }
    const completo = must(agregarSubprocesos(vacio, { opd: 'opd-100', bandas: [['Recibir'], ['Despachar']], posicion: 'final' })).modelo; expect(gatesExportacion(completo, { opd: 'opd-100' })).toEqual([]);
});
test('T-081 externo traído dentro rebota con aviso y conserva alcance real', () => {
    const m = refinado(0, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' }), a = m.opds.dc!;
    const limpio: Modelo = congelar({ ...m, opds: { ...m.opds, dc: { ...a, apariciones: { p: a.apariciones.p!, o: a.apariciones.o! } } } });
    const r = traerCosa(limpio, { opd: 'dc', cosa: 'b', x: 120, y: 80 }); expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    const caja = r.valor.modelo.opds.dc!.apariciones.b!; expect(caja.x + caja.ancho <= 0 || caja.x >= 420 || caja.y + caja.alto <= 0 || caja.y >= 500).toBe(true); expect(r.trazas.some(t => t.regla === 'T-081')).toBe(true); expect((r.valor.modelo.opds.dc! as OpdDescomposicion).objetosInternos).toEqual([]); sano(r.valor.modelo);
});
test('T-071 T-079 refinador directo del despliegue permite continuar su propio refinamiento', () => {
    const a = base(), m: Modelo = congelar({ ...a, enlaces: { e: { id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'b' } } });
    const primero = must(desplegar(m, { opd: 'sd', cosa: 'o', modo: 'agregacion' })).modelo;
    const r = must(desplegar(primero, { opd: 'opd-100', cosa: 'b', modo: 'exhibicion', refinadores: ['Peso', 'Color'] }));
    expect(r.modelo.opds['opd-101']).toMatchObject({ padre: 'opd-100', cosa: 'b', modo: 'exhibicion' }); sano(r.modelo);
});
test('T-083 DS16 no materializa C+C inválida y declara pérdidas; cascada conserva externo', () => {
    const a = refinado(3, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'a' }), m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, segundo: { id: 'segundo', tipo: 'consumo', objeto: 'o', proceso: 'z' } } }); sano(m);
    expect(proyectar(m, 'sd').conflictos.some(d => d.codigo === 'precedencia-invalida')).toBe(true);
    const respuesta = eliminarRefinamiento(m, { opd: 'dc' }), r = must(respuesta); expect(r.modelo.enlaces).toEqual({}); expect(r.modelo.cosas.o).toBe(m.cosas.o); expect(respuesta.ok && respuesta.trazas.some(t => t.regla === 'AP-30')).toBe(true); sano(r.modelo);
});
test('T-080 DS16 materialización conserva hecho de mayor fuerza con ID original', () => {
    const a = refinado(3, { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', salida: 's1' }), m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, i: { id: 'i', tipo: 'instrumento', objeto: 'o', proceso: 'z' } } }); sano(m);
    const r = must(eliminarRefinamiento(m, { opd: 'dc' })); expect(r.modelo.enlaces).toEqual({ e: { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' } }); sano(r.modelo);
});
test('T-087 colección incompleta es derivada, añadir refinador conserva declaración del modelador', () => {
    const a = base(), m: Modelo = congelar({ ...a, cosas: { ...a.cosas, o: { ...a.cosas.o!, incompleta: ['agregacion'] } }, enlaces: { e: { id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'b' } } });
    const r = must(desplegar(m, { opd: 'sd', cosa: 'o', modo: 'agregacion', refinadores: ['Documento'] })).modelo;
    expect(r.cosas.o!.incompleta).toEqual(['agregacion']); expect(proyectar(r, 'opd-100').incompletas).toEqual(expect.arrayContaining([{ refinable: 'o', relacion: 'agregacion', declarada: true }]));
    sano(r);
    const parcial: Modelo = congelar({ ...r, cosas: { ...r.cosas, o: { ...r.cosas.o!, incompleta: [] } } });
    expect(proyectar(parcial, 'sd').incompletas.some(x => x.refinable === 'o' && !x.declarada)).toBe(true); expect(diagnosticar(parcial).some(d => d.codigo === 'ajuste-automatico' && d.opd === 'sd')).toBe(true); sano(parcial);
});

for (const consumidor of ['consulta', 'creación', 'reparación'] as const)
    test(`T-020 DS20 ${consumidor} rechaza F13 en el resultado final efectivo`, () => {
        const a = refinado(3, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' });
        const m: Modelo = congelar({ ...a, cosas: { ...a.cosas, b: { ...a.cosas.b! as Objeto, valor: 'uno' } } });
        expect(validarForma(m).some(v => v.regla === 'F-13')).toBe(true);
        const antes = JSON.stringify(m);
        if (consumidor === 'consulta') {
            const menu = tiposLegales(m, { opd: 'sd', desde: { cosa: 'b' }, hacia: { cosa: 'p' } });
            expect(menu.find(o => o.tipo === 'consumo' && o.sentido === 'directo')!.legal).toBe(false);
        } else {
            const r = consumidor === 'creación' ? crearEnlace(m, { opd: 'sd', candidato: { tipo: 'consumo', objeto: 'b', proceso: 'p' } }) : distribuirEnlace(m, { enlace: 'e' });
            expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe('forma');
        }
        expect(JSON.stringify(m)).toBe(antes);
    });
test('T-075 DS20 colisión sólo en borrador se resuelve al distribuir antes del cierre', () => {
    const m = refinado(3, { id: 'e', tipo: 'resultado', objeto: 'o', proceso: 'c', estado: 's1' }); sano(m);
    const menu = tiposLegales(m, { opd: 'sd', desde: { cosa: 'o', estado: 's0' }, hacia: { cosa: 'p' } });
    expect(menu.find(o => o.tipo === 'consumo' && o.sentido === 'directo')!.legal).toBe(true);
    const r = must(crearEnlace(m, { opd: 'sd', candidato: { tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's0' } }));
    expect(r.modelo.enlaces['e-100']).toEqual({ id: 'e-100', tipo: 'consumo', objeto: 'o', proceso: 'a', estado: 's0' }); sano(r.modelo);
    const borrador: Modelo = congelar({ ...m, enlaces: { ...m.enlaces, nuevo: { id: 'nuevo', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's0' } } });
    expect(erroresContexto(borrador).length).toBeGreaterThan(0);
    const reparado = must(distribuirEnlace(borrador, { enlace: 'nuevo' })).modelo;
    expect(reparado.enlaces.nuevo).toMatchObject({ proceso: 'a', estado: 's0' }); sano(reparado);
});

for (const operador of ['XOR', 'OR'] as const) for (const n of [0, 1, 3] as const)
    test(`T-073 T-074 DS4 TS3 fan ${operador} con ${n} hijos conserva ramas completas`, () => {
        const a = refinado(n, { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' });
        const m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, segundo: { id: 'segundo', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's2' } }, abanicos: { f: { id: 'f', operador, enlaces: ['e', 'segundo'] } } });
        expect(validarForma(m)).toEqual([]);
        const r = must(distribuirEnlace(m, { enlace: 'segundo' })), esperado = n ? 'a' : 'p';
        expect(r.modelo.enlaces).toEqual({ e: conProceso(m.enlaces.e!, esperado), segundo: conProceso(m.enlaces.segundo!, esperado) });
        expect(r.modelo.abanicos).toBe(m.abanicos); expect(r.creados).toEqual([]); expect(r.modelo.secuencia).toBe(100); expect(validarForma(r.modelo)).toEqual([]); if (n) expect(erroresContexto(r.modelo)).toEqual([]);
    });
for (const tipo of ['consumo', 'resultado'] as const) for (const operador of ['XOR', 'OR'] as const)
    test(`T-073 T-075 ${tipo} fan ${operador} con común P arrastra ambas ramas y conserva rutas`, () => {
        const estado = tipo === 'consumo' ? 's0' : 's1', a = refinado(3, { id: 'e', tipo, objeto: 'o', proceso: 'p', estado, ruta: 'ruta_a' });
        const m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, segundo: { id: 'segundo', tipo, objeto: 'b', proceso: 'p', ruta: 'ruta_b' } }, abanicos: { f: { id: 'f', operador, enlaces: ['e', 'segundo'] } } });
        expect(validarForma(m)).toEqual([]); const r = must(distribuirEnlace(m, { enlace: 'e' })), destino = tipo === 'consumo' ? 'a' : 'c';
        expect(r.modelo.enlaces.e).toEqual(conProceso(m.enlaces.e!, destino)); expect(r.modelo.enlaces.segundo).toEqual(conProceso(m.enlaces.segundo!, destino)); expect(r.modelo.abanicos).toBe(m.abanicos); sano(r.modelo);
    });
for (const operador of ['XOR', 'OR'] as const)
    test(`T-073 T-075 fan ${operador} común O no arrastra proceso diferente`, () => {
        const a = refinado(3, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' });
        const m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, segundo: { id: 'segundo', tipo: 'consumo', objeto: 'o', proceso: 'q' } }, abanicos: { f: { id: 'f', operador, enlaces: ['e', 'segundo'] } } });
        expect(validarForma(m)).toEqual([]); const r = must(distribuirEnlace(m, { enlace: 'e' }));
        expect(r.modelo.enlaces.e).toMatchObject({ proceso: 'a' }); expect(r.modelo.enlaces.segundo).toBe(m.enlaces.segundo); expect(r.modelo.abanicos).toBe(m.abanicos); sano(r.modelo);
    });
test('T-074 T-075 escisión recursiva conserva par en destinos finales y aparición externa', () => {
    const a = must(descomponer(base(), { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] })).modelo;
    const b = must(descomponer(a, { opd: 'opd-100', proceso: 'p-101', bandas: [['Inspeccionar'], ['Aceptar']] })).modelo;
    const c = must(descomponer(b, { opd: 'opd-100', proceso: 'p-102', bandas: [['Preparar'], ['Entregar']] })).modelo;
    const r = must(crearEnlace(c, { opd: 'sd', candidato: { tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' } }));
    expect(r.creados).toEqual(['e-109', 'e-110']);
    expect(r.modelo.enlaces['e-109']).toEqual({ id: 'e-109', tipo: 'efecto', objeto: 'o', proceso: 'p-104', entrada: 's0', escision: { par: 'e-110', mitad: 'entrada' } });
    expect(r.modelo.enlaces['e-110']).toEqual({ id: 'e-110', tipo: 'efecto', objeto: 'o', proceso: 'p-108', salida: 's1', escision: { par: 'e-109', mitad: 'salida' } });
    for (const id of ['opd-100', 'opd-103', 'opd-106']) expect(r.modelo.opds[id]!.apariciones.o).toBeDefined(); sano(r.modelo);
});
test('T-080 T-083 despliegue eliminado borra sólo refinadores de aparición exclusiva', () => {
    const a = base({ id: 'e', tipo: 'exhibicion', refinable: 'o', refinador: 'b' });
    const m = must(desplegar(a, { opd: 'sd', cosa: 'o', modo: 'exhibicion', refinadores: ['Peso', 'Color'] })).modelo;
    const r = must(eliminarRefinamiento(m, { opd: 'opd-100' })).modelo;
    expect(r.cosas).toEqual(a.cosas); expect(r.enlaces).toEqual(a.enlaces); expect(r.opds).toEqual(a.opds); sano(r);
});
test('T-080 T-083 internos con estados/enlaces se eliminan; abanico residual se disuelve', () => {
    const a = refinado(3, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' });
    const b = must(crearCosa(a, { opd: 'dc', tipo: 'objeto', nombre: 'Registro', x: 150, y: 250, alcance: 'interno' })).modelo;
    const m: Modelo = congelar({ ...b, cosas: { ...b.cosas, 'o-100': { ...b.cosas['o-100']! as Objeto, esencia: 'fisica', estados: [{ id: 'interno-listo', nombre: 'listo' }] } }, enlaces: { ...b.enlaces, uno: { id: 'uno', tipo: 'agente', objeto: 'o-100', proceso: 'a', estado: 'interno-listo' }, dos: { id: 'dos', tipo: 'agente', objeto: 'o-100', proceso: 'z' } }, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['uno', 'dos'] } } });
    sano(m); const r = must(eliminarRefinamiento(m, { opd: 'dc' })).modelo;
    expect(r.cosas['o-100']).toBeUndefined(); expect(r.abanicos).toEqual({}); expect(r.enlaces).toEqual(a.enlaces); expect(r.cosas.o).toBe(a.cosas.o); sano(r);
});

for (const n of [0, 1, 3] as const) for (const [nombre, control] of [['condición', 'c'], ['evento sistémico', 'e']] as const)
    test(`T-073 consumo ${nombre} con ${n} hijos conserva control, estado y ruta`, () => {
        const m = refinado(n, { id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 's0', control, ruta: 'ruta_a' });
        expect(validarForma(m)).toEqual([]); const r = must(distribuirEnlace(m, { enlace: 'e' }));
        expect(r.modelo.enlaces.e).toEqual(conProceso(m.enlaces.e!, n ? 'a' : 'p')); expect(r.creados).toEqual([]); expect(validarForma(r.modelo)).toEqual([]); if (n) expect(erroresContexto(r.modelo)).toEqual([]);
    });
for (const tipo of ['efecto', 'agente', 'instrumento'] as const) for (const n of [0, 1, 3] as const)
    test(`T-073 ${tipo} evento ambiental con ${n} hijos queda distributivo en contorno`, () => {
        const a = refinado(n, { id: 'e', tipo, objeto: 'o', proceso: 'p', control: 'e' }), m: Modelo = congelar({ ...a, cosas: { ...a.cosas, o: { ...a.cosas.o!, afiliacion: 'ambiental' } } });
        sano(m); const r = must(distribuirEnlace(m, { enlace: 'e' })); expect(r.modelo.enlaces.e).toBe(m.enlaces.e); expect(r.creados).toEqual([]); sano(r.modelo);
    });
for (const sentido of ['directo', 'inverso'] as const)
    test(`T-040 T-074 B-28 consulta/creación efecto anclado recursivo ${sentido} conserva estados/IDs`, () => {
        const a = must(descomponer(base(), { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] })).modelo;
        const b = must(descomponer(a, { opd: 'opd-100', proceso: 'p-101', bandas: [['Inspeccionar'], ['Aceptar']] })).modelo;
        const desde = sentido === 'directo' ? { cosa: 'p' } : { cosa: 'o', estado: 's0' }, hacia = sentido === 'directo' ? { cosa: 'o', estado: 's0' } : { cosa: 'p' };
        const opcion = tiposLegales(b, { opd: 'sd', desde, hacia }).find(o => o.tipo === 'efecto' && o.sentido === sentido)!; expect(opcion.legal).toBe(true);
        const candidato = sentido === 'directo' ? { tipo: 'efecto' as const, objeto: 'o', proceso: 'p', salida: 's0' } : { tipo: 'efecto' as const, objeto: 'o', proceso: 'p', entrada: 's0' };
        const r = must(crearEnlace(b, { opd: 'sd', candidato }));
        expect(r.modelo.enlaces['e-106']).toEqual(sentido === 'directo' ? { id: 'e-106', tipo: 'efecto', objeto: 'o', proceso: 'p-102', salida: 's0' } : { id: 'e-106', tipo: 'efecto', objeto: 'o', proceso: 'p-104', entrada: 's0' }); expect(r.creados).toEqual(['e-106']); sano(r.modelo);
    });

test('T-020 T-080 eliminar interno exhibidor conserva externo y retira valor huérfano final', () => {
    const a = refinado(1, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' });
    const b = must(crearCosa(a, { opd: 'dc', tipo: 'objeto', nombre: 'Registro', x: 140, y: 150, alcance: 'interno' })).modelo;
    const m: Modelo = congelar({ ...b, cosas: { ...b.cosas, b: { ...b.cosas.b! as Objeto, valor: 'uno' } }, enlaces: { ...b.enlaces, rasgo: { id: 'rasgo', tipo: 'exhibicion', refinable: 'o-100', refinador: 'b' } } });
    sano(m); const antes = JSON.stringify(m), respuesta = eliminarRefinamiento(m, { opd: 'dc' });
    expect(JSON.stringify(m)).toBe(antes); const r = must(respuesta).modelo;
    const { valor, ...externo } = m.cosas.b! as Objeto;
    expect(r.cosas.b).toEqual(externo); expect(r.cosas['o-100']).toBeUndefined(); expect(r.enlaces.rasgo).toBeUndefined(); expect(respuesta.ok && respuesta.trazas.some(t => t.regla === 'F-13')).toBe(true); expect(JSON.stringify(m)).toBe(antes); sano(r);
});

test('T-020 T-080 cascada conserva valor externo si persiste otra exhibición', () => {
    const a = refinado(1, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' });
    const b = must(crearCosa(a, { opd: 'dc', tipo: 'objeto', nombre: 'Registro', x: 140, y: 150, alcance: 'interno' })).modelo;
    const m: Modelo = congelar({ ...b, cosas: { ...b.cosas, b: { ...b.cosas.b! as Objeto, valor: 'uno' } }, enlaces: { ...b.enlaces, rasgo: { id: 'rasgo', tipo: 'exhibicion', refinable: 'o-100', refinador: 'b' }, otra: { id: 'otra', tipo: 'exhibicion', refinable: 'o', refinador: 'b' } } });
    sano(m); const respuesta = eliminarRefinamiento(m, { opd: 'dc' }), r = must(respuesta).modelo;
    expect(r.cosas.b).toBe(m.cosas.b); expect(r.enlaces.otra).toBe(m.enlaces.otra); expect(r.enlaces.rasgo).toBeUndefined(); expect(respuesta.ok && respuesta.trazas.some(t => t.regla === 'F-13')).toBe(false); sano(r);
});

test('T-083 rechazo de hoja conserva entrada, secuencia y hechos íntegros', () => {
    const a = must(descomponer(base(), { opd: 'sd', proceso: 'p', bandas: [['Recibir'], ['Despachar']] })).modelo;
    const m = must(descomponer(a, { opd: 'opd-100', proceso: 'p-101' })).modelo; sano(m);
    const antes = JSON.stringify(m), r = eliminarRefinamiento(m, { opd: 'opd-100' });
    expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe('refinamiento-no-hoja'); expect(JSON.stringify(m)).toBe(antes); expect(m.secuencia).toBe(104); sano(m);
});

test('T-072 B-02 operación rechaza descomposición de objeto aun con bandas solicitadas', () => {
    const m = base(), antes = JSON.stringify(m); sano(m);
    const r = descomponer(m, { opd: 'sd', proceso: 'o', bandas: [['Recibir'], ['Despachar']] });
    expect(r.ok).toBe(false); if (!r.ok) { expect(r.rechazo.codigo).toBe('descomposicion-objeto'); expect(r.rechazo.regla).toBe('R-OPL-CX-4'); }
    expect(JSON.stringify(m)).toBe(antes); expect(m.secuencia).toBe(100);
});
test('T-079 despliegue permite propio refinador pero rechaza otro visible externo', () => {
    const a = base({ id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'b' }), b = must(desplegar(a, { opd: 'sd', cosa: 'o', modo: 'agregacion' })).modelo;
    const hijo = b.opds['opd-100']!, m: Modelo = congelar({ ...b, opds: { ...b.opds, 'opd-100': { ...hijo, apariciones: { ...hijo.apariciones, q: { x: 600, y: 0, ancho: 135, alto: 60 } } } } }); sano(m);
    const antes = JSON.stringify(m), r = descomponer(m, { opd: 'opd-100', proceso: 'q' });
    expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe('externo-no-refinable'); expect(JSON.stringify(m)).toBe(antes);
});

// R2: contraejemplos de DS16/LF03; el prefijo del candidato final1 permanece completo.
import { reanclarExtremo } from './enlaces';
import { noOfrecido } from './matriz';
import type { Respuesta, Hecho } from './resultado';

const fuerzaR2: readonly [string, Enlace, Enlace, Enlace][] = [
    ['instrumento primero, efecto después', { id: 'e50', tipo: 'instrumento', objeto: 'o', proceso: 'a' }, { id: 'e51', tipo: 'efecto', objeto: 'o', proceso: 'c', entrada: 's0' }, { id: 'e51', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0' }],
    ['agente evento primero, efecto condición después: clase precede control', { id: 'e50', tipo: 'agente', objeto: 'o', proceso: 'a', control: 'e' }, { id: 'e51', tipo: 'efecto', objeto: 'o', proceso: 'c', entrada: 's0', control: 'c' }, { id: 'e51', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', control: 'c' }],
    ['agente condición primero, agente evento después', { id: 'e50', tipo: 'agente', objeto: 'o', proceso: 'c', control: 'c' }, { id: 'e51', tipo: 'agente', objeto: 'o', proceso: 'a', control: 'e' }, { id: 'e51', tipo: 'agente', objeto: 'o', proceso: 'p', control: 'e' }],
    ['efecto condición primero, efecto base después: anclajes de Vista íntegros', { id: 'e50', tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', control: 'c' }, { id: 'e51', tipo: 'efecto', objeto: 'o', proceso: 'c', salida: 's1' }, { id: 'e51', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' }],
];
for (const [nombre, debil, fuerte, esperado] of fuerzaR2)
    test(`T-080 T-083 R2 DS16 ${nombre} materializa ID fuerte`, () => {
        const a = refinado(3, debil), m: Modelo = congelar({ ...a, enlaces: { [debil.id]: debil, [fuerte.id]: fuerte } });
        sano(m); for (const e of Object.values(m.enlaces)) expect(noOfrecido(m, e)).toBeNull(); expect(gatesExportacion(m, 'modelo')).toEqual([]);
        const vista = proyectar(m, 'sd').enlaces.find(v => v.hechos.includes(debil.id))!;
        expect(vista.hechos).toEqual([debil.id, fuerte.id]); expect(vista.enlace.id).toBe(debil.id);
        const antes = JSON.stringify(m), args = congelar({ opd: 'dc' }), argAntes = JSON.stringify(args), respuesta = eliminarRefinamiento(m, args);
        expect(JSON.stringify(m)).toBe(antes); expect(JSON.stringify(args)).toBe(argAntes);
        const r = must(respuesta); sano(r.modelo); expect(gatesExportacion(r.modelo, 'modelo')).toEqual([]); expect(r.creados).toEqual([]); expect(r.modelo.secuencia).toBe(m.secuencia);
        expect(r.modelo.enlaces).toEqual({ [fuerte.id]: esperado });
    });
for (const inverso of [false, true])
    test(`T-080 T-083 R2 par bilateral empatado ${inverso} conserva uno de sus IDs sin prioridad nueva`, () => {
        const entrada: Enlace = { id: 'entrada', tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', escision: { par: 'salida', mitad: 'entrada' } }, salida: Enlace = { id: 'salida', tipo: 'efecto', objeto: 'o', proceso: 'c', salida: 's1', escision: { par: 'entrada', mitad: 'salida' } };
        const a = refinado(3, entrada), m: Modelo = congelar({ ...a, enlaces: inverso ? { salida, entrada } : { entrada, salida } }); sano(m);
        const r = must(eliminarRefinamiento(m, congelar({ opd: 'dc' }))); const es = Object.values(r.modelo.enlaces);
        expect(es).toHaveLength(1); expect(['entrada', 'salida']).toContain(es[0]!.id); expect(es[0]).toEqual({ id: es[0]!.id, tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' }); expect(r.creados).toEqual([]); sano(r.modelo);
    });

type ConsumidorR2 = 'crear' | 'reanclar' | 'reparar';
function ocultoR2(consumidor: ConsumidorR2, control = false, suprimir = true): Modelo {
    const a = refinado(3, { id: 'temporal', tipo: 'instrumento', objeto: 'b', proceso: 'p' });
    const objeto = a.cosas.o! as Objeto, enlaces: Record<string, Enlace> = {
        piezaA: { id: 'piezaA', tipo: 'agregacion', refinable: 'b', refinador: 'u' }, piezaB: { id: 'piezaB', tipo: 'agregacion', refinable: 'b', refinador: 'v' },
    };
    if (consumidor !== 'crear') enlaces.existente = { id: 'existente', tipo: 'efecto', objeto: 'o', proceso: consumidor === 'reanclar' ? 'q' : 'p', entrada: 's0', salida: 's1', ...(control ? { control: 'c' } : {}) };
    const ocultos = suprimir ? ['s0', 's1', 's2'] : ['s2'];
    return congelar({ ...a, cosas: { ...a.cosas, o: { ...objeto, estados: objeto.estados.map(s => s.id === 's2' || suprimir ? { ...s, suprimido: true } : s) }, u: { id: 'u', tipo: 'objeto', nombre: 'Registro', esencia: 'informacional', afiliacion: 'sistemica', estados: [] }, v: { id: 'v', tipo: 'objeto', nombre: 'Archivo', esencia: 'informacional', afiliacion: 'sistemica', estados: [] } }, enlaces,
        opds: { ...Object.fromEntries(Object.entries(a.opds).map(([id, o]) => [id, { ...o, apariciones: { ...o.apariciones, o: { ...o.apariciones.o!, ocultos } } }])), ajeno: { id: 'ajeno', tipo: 'despliegue', padre: 'sd', cosa: 'b', modo: 'agregacion', orden: 1, apariciones: { b: { x: 0, y: 0, ancho: 135, alto: 60 }, u: { x: 0, y: 200, ancho: 135, alto: 60 }, v: { x: 200, y: 200, ancho: 135, alto: 60 }, o: { x: 500, y: 200, ancho: 135, alto: 60, ocultos: ['s0', 's1', 's2'] } } } } });
}
function ejecutarR2(consumidor: ConsumidorR2, control = false, suprimir = true): { original: Modelo; respuesta: Respuesta<Hecho> } {
    const m = ocultoR2(consumidor, control, suprimir), antes = JSON.stringify(m);
    expect(validarForma(m)).toEqual([]); for (const e of Object.values(m.enlaces)) expect(noOfrecido(m, e)).toBeNull();
    const reglas = consumidor === 'reparar' && !control ? ['AP-07'] : []; expect(erroresContexto(m).map(v => v.regla)).toEqual(reglas);
    const gates = gatesExportacion(m, 'modelo'); if (reglas.length) { expect(gates.length).toBeGreaterThan(0); expect(gates.every(g => g.regla.includes('AP-07'))).toBe(true); } else expect(gates).toEqual([]);
    let respuesta: Respuesta<Hecho>;
    if (consumidor === 'crear') { const args = congelar({ opd: 'sd', candidato: { tipo: 'efecto' as const, objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1', ...(control ? { control: 'c' as const } : {}) } }), previo = JSON.stringify(args); respuesta = crearEnlace(m, args); expect(JSON.stringify(args)).toBe(previo); }
    else if (consumidor === 'reanclar') { const args = congelar({ opd: 'sd', enlace: 'existente', extremo: 'origen' as const, hacia: { cosa: 'p' } }), previo = JSON.stringify(args); respuesta = reanclarExtremo(m, args); expect(JSON.stringify(args)).toBe(previo); }
    else { const args = congelar({ enlace: 'existente' }), previo = JSON.stringify(args); respuesta = distribuirEnlace(m, args); expect(JSON.stringify(args)).toBe(previo); }
    expect(JSON.stringify(m)).toBe(antes); const r = must(respuesta); sano(r.modelo); expect(gatesExportacion(r.modelo, 'modelo')).toEqual([]);
    const principal = consumidor === 'crear' ? 'e-100' : 'existente', par = consumidor === 'crear' ? 'e-101' : 'e-100';
    if (control) { expect(r.modelo.enlaces[principal]).toEqual({ id: principal, tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', salida: 's1', control: 'c' }); expect(r.creados).toEqual(consumidor === 'crear' ? ['e-100'] : []); }
    else { expect(r.modelo.enlaces[principal]).toEqual({ id: principal, tipo: 'efecto', objeto: 'o', proceso: 'a', entrada: 's0', escision: { par, mitad: 'entrada' } }); expect(r.modelo.enlaces[par]).toEqual({ id: par, tipo: 'efecto', objeto: 'o', proceso: 'c', salida: 's1', escision: { par: principal, mitad: 'salida' } }); expect(r.creados).toEqual(consumidor === 'crear' ? ['e-100', 'e-101'] : ['e-100']); }
    expect(r.modelo.secuencia).toBe(100 + r.creados.length);
    for (const opd of ['sd', 'dc']) expect(proyectar(r.modelo, opd).cosas.find(c => c.cosa === 'o')!.estadosVisibles).toEqual(['s0', 's1']);
    return { original: m, respuesta };
}
for (const consumidor of ['crear', 'reanclar', 'reparar'] as const) for (const predicado of ['global', 'local', 'traza'] as const)
    test(`T-018 T-074 R2 LF03 ${consumidor} ${predicado} alcanza ambas mitades`, () => {
        const { original, respuesta } = ejecutarR2(consumidor), r = must(respuesta), o = r.modelo.cosas.o! as Objeto;
        console.info('R2 LF03 observado ' + JSON.stringify({ consumidor, predicado, estados: o.estados, ocultos: Object.fromEntries(Object.entries(r.modelo.opds).map(([id, o]) => [id, o.apariciones.o?.ocultos])), trazas: respuesta.ok ? respuesta.trazas : [], enlaces: r.modelo.enlaces }));
        if (predicado === 'global') { for (const id of ['s0', 's1']) expect(o.estados.find(s => s.id === id)).not.toHaveProperty('suprimido'); expect(o.estados.find(s => s.id === 's2')!.suprimido).toBe(true); }
        if (predicado === 'local') { for (const opd of ['sd', 'dc']) expect(r.modelo.opds[opd]!.apariciones.o!.ocultos).toEqual(['s2']); expect(r.modelo.opds.ajeno!.apariciones.o).toBe(original.opds.ajeno!.apariciones.o); }
        if (predicado === 'traza') {
            if (!respuesta.ok) throw Error('Respuesta fallida'); const lf = respuesta.trazas.filter(t => t.regla === 'LF-03'); expect(lf).toHaveLength(6);
            for (const id of ['s0', 's1']) { expect(lf.filter(t => t.refs.some(r => r.tipo === 'estado' && r.id === id) && !t.refs.some(r => r.tipo === 'opd'))).toHaveLength(1); for (const opd of ['sd', 'dc']) expect(lf.filter(t => t.refs.some(r => r.tipo === 'estado' && r.id === id) && t.refs.some(r => r.tipo === 'opd' && r.id === opd))).toHaveLength(1); }
            expect(lf.some(t => t.refs.some(r => r.id === 's2' || r.id === 'ajeno'))).toBe(false);
        }
    });
for (const control of [false, true])
    test(`T-018 T-074 R2 LF03 controles: supresión${control}, TS3 entero${control}, sin limpieza ajena`, () => {
        const { original, respuesta } = ejecutarR2('crear', control, control), r = must(respuesta), o = r.modelo.cosas.o! as Objeto;
        for (const id of ['s0', 's1']) expect(o.estados.find(s => s.id === id)).not.toHaveProperty('suprimido');
        for (const opd of ['sd', 'dc']) expect(r.modelo.opds[opd]!.apariciones.o!.ocultos).toEqual(['s2']);
        expect(r.modelo.opds.ajeno!.apariciones.o).toBe(original.opds.ajeno!.apariciones.o);
        expect(respuesta.ok && respuesta.trazas.filter(t => t.regla === 'LF-03').length).toBe(control ? 6 : 0);
    });
test('T-018 T-074 R2 LF03 colisión final rechaza con rollback de flags, ocultos e IDs', () => {
    const a = ocultoR2('crear'), m: Modelo = congelar({ ...a, enlaces: { ...a.enlaces, previo: { id: 'previo', tipo: 'consumo', objeto: 'o', proceso: 'a', estado: 's0' } } }); sano(m);
    const args = congelar({ opd: 'sd', candidato: { tipo: 'efecto' as const, objeto: 'o', proceso: 'p', entrada: 's0', salida: 's1' } }), antes = JSON.stringify(m), aa = JSON.stringify(args), r = crearEnlace(m, args);
    expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe('contexto'); expect(JSON.stringify(m)).toBe(antes); expect(JSON.stringify(args)).toBe(aa); expect(m.secuencia).toBe(100);
});
