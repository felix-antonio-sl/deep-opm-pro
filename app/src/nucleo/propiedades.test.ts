import { afterEach, expect, test } from 'bun:test';
import { modeloCon, congelar } from '../pruebas/constructores';
import { azar } from '../pruebas/azar';
import { crearEnlace } from './enlaces';
import { tiposLegales } from './matriz';
import { validarForma } from './forma';
import type { Modelo, TipoEnlace, EnlaceNuevo } from './tipos';
import type { ExtremoRef } from './operaciones';
// Tabla de intenciones transcrita de CANON §2; no se construye a partir de una opción aceptada.
const tipos: readonly TipoEnlace[] = ['consumo', 'resultado', 'efecto', 'agente', 'instrumento', 'invocacion', 'agregacion', 'exhibicion', 'generalizacion', 'clasificacion', 'etiquetado', 'etiquetadoBidireccional', 'reciproco', 'excepcionSobretiempo', 'excepcionSubtiempo'];
function intencion(tipo: TipoEnlace, desde: ExtremoRef, hacia: ExtremoRef, sentido: 'directo' | 'inverso'): EnlaceNuevo {
    const a = sentido === 'directo' ? desde : hacia, b = sentido === 'directo' ? hacia : desde;
    let e: Record<string, unknown>;
    switch (tipo) {
        case 'consumo':
        case 'agente':
        case 'instrumento':
            e = { tipo, objeto: a.cosa, proceso: b.cosa, ...(a.estado ? { estado: a.estado } : {}), ...(b.estado ? { estadoDestino: b.estado } : {}) };
            break;
        case 'resultado':
            e = { tipo, objeto: b.cosa, proceso: a.cosa, ...(b.estado ? { estado: b.estado } : {}), ...(a.estado ? { estadoOrigen: a.estado } : {}) };
            break;
        case 'efecto':
            e = { tipo, objeto: b.cosa, proceso: a.cosa, ...(desde.estado && desde.cosa === b.cosa ? { entrada: desde.estado } : {}), ...(hacia.estado && hacia.cosa === b.cosa ? { salida: hacia.estado } : {}), ...(a.estado ? { estadoOrigen: a.estado } : {}) };
            break;
        case 'generalizacion':
            e = { tipo, refinable: a.cosa, refinador: b.cosa, ...(a.estado || b.estado ? { estados: { ...(a.estado ? { general: a.estado } : {}), ...(b.estado ? { especializacion: b.estado } : {}) } } : {}) };
            break;
        case 'agregacion':
        case 'exhibicion':
        case 'clasificacion':
            e = { tipo, refinable: a.cosa, refinador: b.cosa, ...(a.estado ? { estadoOrigen: a.estado } : {}), ...(b.estado ? { estadoDestino: b.estado } : {}) };
            break;
        case 'etiquetado':
            e = { tipo, origen: a.cosa, destino: b.cosa, etiqueta: 'conoce', ...(a.estado ? { estadoOrigen: a.estado } : {}), ...(b.estado ? { estadoDestino: b.estado } : {}) };
            break;
        case 'etiquetadoBidireccional':
            e = { tipo, origen: a.cosa, destino: b.cosa, etiqueta: 'conoce', inversa: 'es-conocido', ...(a.estado ? { estadoOrigen: a.estado } : {}), ...(b.estado ? { estadoDestino: b.estado } : {}) };
            break;
        case 'reciproco':
            e = { tipo, origen: a.cosa, destino: b.cosa, etiqueta: 'conoce', ...(a.estado || b.estado ? { estados: { ...(a.estado ? { origen: a.estado } : {}), ...(b.estado ? { destino: b.estado } : {}) } } : {}) };
            break;
        default: e = { tipo, origen: a.cosa, destino: b.cosa, ...(a.estado ? { estadoOrigen: a.estado } : {}), ...(b.estado ? { estadoDestino: b.estado } : {}) };
    }
    return e as unknown as EnlaceNuevo;
}
const originales: Modelo[] = [];
afterEach(() => {
    for (const m of originales.splice(0))
        expect(validarForma(m)).toEqual([]);
});
const muestras = [modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']], ['Caja', []]], procesos: ['Procesar'] }), modeloCon({ objetos: [['Agua', ['fria', 'caliente']], ['Peso', ['alto']]], procesos: ['Hervir', 'Medir'], enlaces: [['consumo', 'Agua', 'Hervir']] }), modeloCon({ objetos: [['Pedido', ['creado', 'pagado']], ['Factura', ['emitida']]], procesos: ['Pagar', 'Emitir'], enlaces: [['exhibicion', 'Pedido', 'Factura'], ['instrumento', 'Factura', 'Emitir']] })];
for (const [i, m] of [...muestras, ...Array.from({ length: 50 }, (_, i) => azar(i + 1, 'completo'))].entries())
    test(`T-040 propiedad exhaustiva ${i < 3 ? 'muestra ' + (i + 1) : 'semilla ' + (i - 2)}: todos pares, 15 tipos, ambas orientaciones`, () => {
        const snapshot = JSON.stringify(m);
        originales.push(m);
        const extremos: ExtremoRef[] = Object.values(m.cosas).flatMap(c => [{ cosa: c.id }, ...(c.tipo === 'objeto' ? c.estados.map(s => ({ cosa: c.id, estado: s.id })) : [])]);
        let evaluados = 0, aceptados = 0, rechazados = 0;
        for (const desde of extremos)
            for (const hacia of extremos) {
                const opciones = tiposLegales(m, { opd: m.raiz, desde, hacia, etiquetas: { etiqueta: 'conoce', inversa: 'es-conocido' } });
                expect(opciones).toHaveLength(30);
                for (const tipo of tipos)
                    for (const sentido of ['directo', 'inverso'] as const) {
                        const opcion = opciones.find(x => x.tipo === tipo && x.sentido === sentido)!;
                        const candidato = congelar(intencion(tipo, desde, hacia, sentido));
                        const r = crearEnlace(m, { opd: m.raiz, candidato });
                        evaluados++;
                        expect(r.ok, JSON.stringify({ muestra: i, tipo, sentido, desde, hacia, candidato, opcion, respuesta: r.ok ? 'ok' : r.rechazo })).toBe(opcion.legal === true);
                        if (r.ok) {
                            aceptados++;
                            expect(validarForma(r.valor.modelo)).toEqual([]);
                            expect(r.valor.creados).toEqual([`e-${m.secuencia}`]);
                        }
                        else
                            rechazados++;
                    }
            }
        expect(evaluados).toBe(extremos.length ** 2 * 30);
        expect(aceptados + rechazados).toBe(evaluados);
        expect(JSON.stringify(m)).toBe(snapshot);
    }, 120000);
test('T-120 pendientes no tienen candidato ni IDs, completación y normalización reales', () => {
    const m = muestras[0]!, desde = { cosa: 'o-2', estado: 's-3' }, hacia = { cosa: 'o-5' };
    const antes = JSON.stringify(m);
    const opciones = tiposLegales(m, { opd: m.raiz, desde, hacia });
    const pendientes = opciones.filter(x => x.legal === 'pendiente');
    expect(pendientes.length).toBeGreaterThan(0);
    for (const p of pendientes) {
        expect(p).not.toHaveProperty('candidato');
        expect(p).not.toHaveProperty('id');
    }
    for (const etiquetas of [{ etiqueta: null, inversa: 'conoce' }, { etiqueta: '', inversa: '' }, { etiqueta: ' inválida', inversa: 'conoce' }]) {
        const o = tiposLegales(m, { opd: m.raiz, desde, hacia, etiquetas }).find(x => x.tipo === 'etiquetadoBidireccional' && x.sentido === 'directo')!;
        expect(o.legal).toBe(false);
    }
    const o = tiposLegales(m, { opd: m.raiz, desde, hacia, etiquetas: { etiqueta: 'conoce', inversa: 'conoce' } }).find(x => x.tipo === 'etiquetadoBidireccional' && x.sentido === 'directo')!;
    expect(o.legal).toBe(true);
    if (o.legal === true) {
        expect(o.candidato.tipo).toBe('etiquetadoBidireccional');
        const r = crearEnlace(m, { opd: m.raiz, candidato: o.candidato });
        expect(r.ok).toBe(true);
        if (r.ok) {
            expect(r.valor.modelo.enlaces[`e-${m.secuencia}`]).toHaveProperty('tipo', 'reciproco');
            expect(r.trazas.some(t => t.regla === 'R-STRE-1')).toBe(true);
            expect(validarForma(r.valor.modelo)).toEqual([]);
        }
    }
    expect(JSON.stringify(m)).toBe(antes);
});
