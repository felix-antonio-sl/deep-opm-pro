import { expect, test } from 'bun:test';
import type { Modelo, OpdDescomposicion, Opd } from './tipos';
import { agrupar, descomponer, desplegar } from './refinamiento';
import { traerCosa } from './cosas';
import { fijarControl } from './enlaces';
import type { CodigoRechazo } from './resultado';
import { validarForma } from './forma';
import { erroresContexto } from './matriz';
import { indice } from './indice';
import { proyectar } from './proyeccion';
import { congelar, modeloCon, must, porNombre } from '../pruebas/constructores';
import { generarDocumentoOpl, importarOpl } from '../opl/documento';

// T-325 (§3.2b, método A4.5): agrupar procesos bajo un proceso intermedio nuevo y descomponerlo con ellos.
function sano(m: Modelo) { expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]); }
const nombres = (m: Modelo, ids: readonly (readonly string[])[]) => ids.map(b => b.map(id => m.cosas[id]!.nombre));
const id = (m: Modelo, n: string) => porNombre(m, n).id;
function mover(m: Modelo, opd: string, cosa: string, y: number): Modelo {
    const o = m.opds[opd]!;
    return congelar({ ...m, opds: { ...m.opds, [opd]: { ...o, apariciones: { ...o.apariciones, [cosa]: { ...o.apariciones[cosa]!, y } } } as Opd } });
}
function sd(): Modelo {
    const b = modeloCon({ objetos: [['Pedido', []], ['Factura', []], ['Cliente', []]], procesos: ['Recibir Pedido', 'Emitir Factura', 'Cobrar Factura'],
        enlaces: [['consumo', 'Pedido', 'Recibir Pedido'], ['resultado', 'Factura', 'Emitir Factura'], ['agente', 'Cliente', 'Cobrar Factura']] });
    return mover(mover(b, b.raiz, id(b, 'Emitir Factura'), 250), b.raiz, id(b, 'Cobrar Factura'), 500);
}
function atender(): { m: Modelo; o: OpdDescomposicion } {
    const c = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Atender'], enlaces: [['efecto', 'Pedido', 'Atender']] });
    const m = must(descomponer(c, { opd: c.raiz, cosa: id(c, 'Atender'), bandas: [['Recibir'], ['Revisar', 'Pesar'], ['Despachar'], ['Cobrar']] })).modelo;
    return { m, o: Object.values(m.opds).find((x): x is OpdDescomposicion => x.tipo === 'descomposicion')! };
}

test('T-325 agrupar en el SD crea el proceso y su descomposición por altura, sin tocar hechos', () => {
    const m = sd(), antes = JSON.stringify(m); sano(m);
    const r = must(agrupar(m, { opd: m.raiz, cosas: [id(m, 'Emitir Factura'), id(m, 'Recibir Pedido')], nombre: 'Atender Pedido' }));
    const n = r.modelo, [p, h] = r.creados as [string, string], d = n.opds[h] as OpdDescomposicion;
    expect(n.cosas[p]).toMatchObject({ tipo: 'proceso', nombre: 'Atender Pedido' });
    expect(d).toMatchObject({ padre: m.raiz, cosa: p, internos: [] }); expect(nombres(n, d.bandas)).toEqual([['Recibir Pedido'], ['Emitir Factura']]);
    expect(n.enlaces).toBe(m.enlaces); expect(n.abanicos).toBe(m.abanicos);
    // R-HIJO-3: los externos del hijo son las cosas del origen unidas a lo agrupado.
    expect(Object.keys(d.apariciones).map(x => n.cosas[x]!.nombre).sort()).toEqual(['Atender Pedido', 'Emitir Factura', 'Factura', 'Pedido', 'Recibir Pedido']);
    // DR-13: el SD muestra los hechos abstraídos en el proceso nuevo; Cobrar Factura no se agrupó.
    const vista = proyectar(n, n.raiz);
    expect(vista.cosas.map(v => n.cosas[v.cosa]!.nombre).sort()).toEqual(['Atender Pedido', 'Cliente', 'Cobrar Factura', 'Factura', 'Pedido']);
    expect(vista.enlaces.filter(v => v.abstraido).map(v => [v.enlace.tipo, n.cosas[(v.enlace as { proceso: string }).proceso]!.nombre])).toEqual([['consumo', 'Atender Pedido'], ['resultado', 'Atender Pedido']]);
    sano(n); expect(JSON.stringify(m)).toBe(antes);
});

test('T-325 R-INV-2 en una descomposición se agrupan bandas contiguas completas o parte de una banda', () => {
    const { m, o } = atender();
    const [recibir, revisar, pesar, despachar, cobrar] = o.bandas.flat() as [string, string, string, string, string];
    const a = must(agrupar(m, { opd: o.id, cosas: [revisar, pesar, despachar], nombre: 'Preparar Envío' })).modelo;
    expect(nombres(a, (a.opds[o.id] as OpdDescomposicion).bandas)).toEqual([['Recibir'], ['Preparar Envío'], ['Cobrar']]);
    expect(nombres(a, (Object.values(a.opds).find(x => x.tipo === 'descomposicion' && x.cosa === id(a, 'Preparar Envío')) as OpdDescomposicion).bandas)).toEqual([['Revisar', 'Pesar'], ['Despachar']]);
    sano(a);
    // Parte de una banda paralela: el grupo queda en paralelo con el resto y conserva el paralelo dentro.
    const b = must(agrupar(m, { opd: o.id, cosas: [pesar], nombre: 'Pesar Bultos' })).modelo;
    expect(nombres(b, (b.opds[o.id] as OpdDescomposicion).bandas)).toEqual([['Recibir'], ['Revisar', 'Pesar Bultos'], ['Despachar'], ['Cobrar']]);
    sano(b);
    for (const cosas of [[recibir, despachar], [revisar, despachar], [recibir, revisar, pesar, cobrar]]) {
        const r = agrupar(m, { opd: o.id, cosas, nombre: 'Algo Distinto' });
        expect(r.ok).toBe(false); if (!r.ok) expect(r.rechazo.regla).toBe('R-INV-2');
    }
});

test('T-325 los refinamientos de lo agrupado pasan bajo el grupo con su subárbol', () => {
    const { m, o } = atender(), [, revisar, pesar] = o.bandas.flat() as [string, string, string];
    const d = must(descomponer(m, { opd: o.id, cosa: revisar, bandas: [['Mirar'], ['Anotar']] })).modelo;
    const r = must(agrupar(d, { opd: o.id, cosas: [revisar, pesar], nombre: 'Controlar Pedido' })), n = r.modelo, h = r.creados[1]!;
    const sub = Object.values(n.opds).find(x => x.tipo === 'descomposicion' && x.cosa === revisar)!;
    expect(sub).toMatchObject({ padre: h, orden: 0 }); expect(indice(n).etiqueta.get(sub.id)).toBe('SD1.1.1');
    expect(indice(n).hijosDe.get(o.id)).toEqual([h]); sano(n);
});

test('T-325 A3.3 un objeto elegido pasa a interno del grupo sólo si nada fuera lo muestra', () => {
    const b = modeloCon({ objetos: [['Borrador', []], ['Pedido', []]], procesos: ['Redactar Texto', 'Revisar Texto'],
        enlaces: [['resultado', 'Borrador', 'Redactar Texto'], ['consumo', 'Borrador', 'Revisar Texto'], ['resultado', 'Pedido', 'Revisar Texto']] });
    const m = mover(b, b.raiz, id(b, 'Revisar Texto'), 250);
    const r = must(agrupar(m, { opd: m.raiz, cosas: [id(m, 'Redactar Texto'), id(m, 'Revisar Texto'), id(m, 'Borrador')], nombre: 'Escribir Texto' })), n = r.modelo;
    expect((n.opds[r.creados[1]!] as OpdDescomposicion).internos).toEqual([id(m, 'Borrador')]);
    expect(Object.hasOwn(n.opds[n.raiz]!.apariciones, id(m, 'Borrador'))).toBe(false); sano(n);
    // Un objeto que también se ve en otro OPD no se vuelve interno.
    const otro = must(desplegar(m, { opd: m.raiz, cosa: id(m, 'Pedido'), modo: 'agregacion' })).modelo, hijo = Object.keys(otro.opds).find(x => x !== otro.raiz)!;
    const visto = must(traerCosa(otro, { opd: hijo, cosa: id(m, 'Borrador'), x: 400, y: 300 })).modelo;
    const x = agrupar(visto, { opd: m.raiz, cosas: [id(m, 'Redactar Texto'), id(m, 'Revisar Texto'), id(m, 'Borrador')], nombre: 'Escribir Texto' });
    expect(x.ok).toBe(false); if (!x.ok) expect(x.rechazo).toMatchObject({ codigo: 'es-interno', regla: 'A3.3' });
});

test('T-325 rechazos sin reservar IDs: despliegue, externo, sólo objetos, nombre, precedencia y evento', () => {
    const { m, o } = atender(), [recibir] = o.bandas.flat() as [string];
    const pedido = id(m, 'Pedido'), casos: [Parameters<typeof agrupar>[1], CodigoRechazo][] = [
        [{ opd: m.raiz, cosas: [recibir], nombre: 'Algo Distinto' }, 'no-visible'],
        [{ opd: o.id, cosas: [id(m, 'Atender')], nombre: 'Algo Distinto' }, 'externo-no-refinable'],
        [{ opd: o.id, cosas: [recibir], nombre: 'Recibir' }, 'unicidad-nominal'],
        [{ opd: o.id, cosas: [recibir], nombre: 'recibir pedido!' }, 'lexico'],
        [{ opd: m.raiz, cosas: [pedido], nombre: 'Algo Distinto' }, 'forma'],
    ];
    for (const [a, codigo] of casos) {
        const antes = JSON.stringify(m), r = agrupar(m, a);
        expect(r.ok, codigo).toBe(false); if (!r.ok) expect(r.rechazo.codigo).toBe(codigo); expect(JSON.stringify(m)).toBe(antes);
    }
    const u = must(desplegar(m, { opd: m.raiz, cosa: pedido, modo: 'agregacion', refinadores: ['Línea'] })).modelo, du = Object.values(u.opds).find(x => x.tipo === 'despliegue')!;
    const ru = agrupar(u, { opd: du.id, cosas: [pedido], nombre: 'Algo Distinto' }); expect(ru.ok).toBe(false); if (!ru.ok) expect(ru.rechazo.regla).toBe('R-SIMP-1');
    // R-PREC-1: dos consumos del mismo objeto no se recomponen en un solo proceso (AP-30).
    const dos = mover(modeloCon({ objetos: [['Insumo', []]], procesos: ['Mezclar Insumo', 'Cocer Insumo'], enlaces: [['consumo', 'Insumo', 'Mezclar Insumo'], ['consumo', 'Insumo', 'Cocer Insumo']] }), 'opd-1', 'p-3', 250);
    const rp = agrupar(dos, { opd: dos.raiz, cosas: [id(dos, 'Mezclar Insumo'), id(dos, 'Cocer Insumo')], nombre: 'Preparar Insumo' });
    expect(rp.ok).toBe(false); if (!rp.ok) expect(rp.rechazo.regla).toBe('R-PREC-1');
    // R-CX-DIST-2: un evento sistémico no puede quedar cruzando el contorno nuevo.
    const base = modeloCon({ objetos: [['Alarma', []]], procesos: ['Detectar Falla', 'Avisar Falla'], enlaces: [['instrumento', 'Alarma', 'Detectar Falla']] });
    const ev = must(fijarControl(base, { enlace: Object.keys(base.enlaces)[0]!, control: 'e' })).modelo;
    const re = agrupar(ev, { opd: ev.raiz, cosas: [id(ev, 'Detectar Falla'), id(ev, 'Avisar Falla')], nombre: 'Atender Falla' });
    expect(re.ok).toBe(false); if (!re.ok) expect(re.rechazo.regla).toBe('R-CX-DIST-2');
});

test('T-325 T-192 el documento OPL del modelo agrupado se reconstruye idéntico', () => {
    const { m, o } = atender(), [, revisar, pesar, despachar] = o.bandas.flat() as [string, string, string, string];
    const n = must(agrupar(m, { opd: o.id, cosas: [revisar, pesar, despachar], nombre: 'Preparar Envío' })).modelo;
    const t = generarDocumentoOpl(n), r = importarOpl(n.nombre, t);
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.valor.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(r.valor.modelo)).toBe(t);
});
