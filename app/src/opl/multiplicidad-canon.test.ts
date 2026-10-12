import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace, fijarMultiplicidad } from '../nucleo/enlaces';
import { gatesExportacion } from '../nucleo/diagnostico';
import { validarForma } from '../nucleo/forma';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarBloque } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { analizar } from './analizar';
import { planificar } from './planificar';
import type { EnlaceNuevo, Multiplicidad } from '../nucleo/tipos';

for (const tipo of ['consumo', 'resultado', 'efecto', 'instrumento'] as const)
    for (const mult of ['consume', 'genera', 'afecta', 'requiere', 'cambia'])
        test(`T-057 T-133 T-192 B-42 lista ${tipo}/${mult}: un solo AND e inversa de hechos`, () => {
            let m = modeloCon({ objetos: [['Alfa', ['activo']], ['Beta', ['activo']]], procesos: ['Procesar'] });
            for (const [nombre, cantidad] of [['Alfa', undefined], ['Beta', mult]] as const)
                m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo, objeto: porNombre(m, nombre).id,
                    proceso: porNombre(m, 'Procesar').id, ...(cantidad ? { mult: cantidad } : {}) } })).modelo;
            const json = exportarV0(m), doc = generarDocumentoOpl(m), lineas = generarBloque(m, m.raiz).filter(l => l.hechos.length);
            expect(gatesExportacion(m, 'modelo')).toEqual([]);
            expect(lineas).toHaveLength(1); expect(lineas[0]!.plantilla).toBe('AND-' + tipo);
            expect(new Set(lineas[0]!.hechos)).toEqual(new Set(Object.keys(m.enlaces)));
            const r = must(importarOpl(m.nombre, doc)); expect(r.plan.resumen.noAplicables).toBe(0);
            const enlaces = Object.values(r.modelo.enlaces);
            expect(enlaces).toHaveLength(2); expect(enlaces.every(e => e.tipo === tipo)).toBe(true);
            for (const e of enlaces) {
                if (e.tipo !== 'consumo' && e.tipo !== 'resultado' && e.tipo !== 'efecto' && e.tipo !== 'instrumento') throw Error('Firma');
                expect(e.mult).toBe(r.modelo.cosas[e.objeto]?.nombre === 'Beta' ? mult : undefined);
                expect(r.modelo.cosas[e.proceso]?.nombre).toBe('Procesar');
            }
            expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
            expect(exportarV0(m)).toBe(json);
        });

test('T-156 T-157 B-42 conserva compuestos mixtos y restricciones reales sin hechos ni acciones', () => {
    const base = modeloCon({ objetos: [['Alfa', []], ['Beta', []]], procesos: ['Procesar'] }), json = exportarV0(base);
    for (const texto of ['*Procesar* consume **Alfa** y genera **Beta**.', '*Procesar* consume n **Alfa** donde n>=1.']) {
        const l = analizar(texto)[0]!; expect(l.texto).toBe(texto); expect(l.hechos).toEqual([]);
        expect(l.diagnosticos[0]?.codigo).toBe('unsupported-canonical'); expect(planificar(base, base.raiz, texto).acciones).toEqual([]);
    }
    expect(exportarV0(base)).toBe(json);
});

for (const mult of ['donde', 'manejan', 'requieren', 'consumen', 'generan', 'afectan', 'invocan', 'AND', 'OR', 'XOR', 'FANLOCAL'])
    for (const tipo of ['consumo', 'agente', 'etiquetado'] as const)
        test(`T-057 T-150 T-192 B-42 ${tipo}/${mult}: parámetro legal no es prosa ni operador`, () => {
            const base = modeloCon({ objetos: [['Origen', []], ['Destino', []]], procesos: ['Procesar'] });
            const a = porNombre(base, 'Origen').id, b = porNombre(base, 'Destino').id, p = porNombre(base, 'Procesar').id;
            const candidato: EnlaceNuevo = tipo === 'etiquetado'
                ? { tipo, origen: a, destino: b, etiqueta: 'conoce', multDestino: mult }
                : { tipo, objeto: a, proceso: p, mult };
            const m = must(crearEnlace(base, { opd: base.raiz, candidato })).modelo;
            expect(gatesExportacion(m, 'modelo')).toEqual([]);
            const json = exportarV0(m), doc = generarDocumentoOpl(m);
            expect(generarBloque(m, m.raiz).flatMap(l => l.tokens).some(t => t.rol === 'multiplicidad' && t.texto.trim() === mult)).toBe(true);
            expect(analizar(doc).flatMap(l => l.diagnosticos)).toEqual([]);
            const r = must(importarOpl(m.nombre, doc));
            expect(r.plan.resumen.noAplicables).toBe(0);
            const enlaces = Object.values(r.modelo.enlaces);
            expect(enlaces).toHaveLength(1);
            const e = enlaces[0]!;
            if (tipo === 'etiquetado') {
                expect(e.tipo).toBe(tipo); if (e.tipo !== tipo) throw Error('Firma');
                expect(e.multDestino).toBe(mult); expect(e.etiqueta).toBe('conoce');
                expect(r.modelo.cosas[e.origen]?.nombre).toBe('Origen'); expect(r.modelo.cosas[e.destino]?.nombre).toBe('Destino');
            } else {
                expect(e.tipo).toBe(tipo); if (e.tipo !== 'consumo' && e.tipo !== 'agente') throw Error('Firma');
                expect(e.mult).toBe(mult); expect(r.modelo.cosas[e.objeto]?.nombre).toBe('Origen');
                expect(r.modelo.cosas[e.proceso]?.nombre).toBe('Procesar');
            }
            expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
            const recuperado = importarV0(json); expect(recuperado.ok).toBe(true); if (!recuperado.ok) throw Error('Códec');
            expect(exportarV0(recuperado.modelo)).toBe(json); expect(exportarV0(m)).toBe(json);
        });

for (const tipo of ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'] as const)
    for (const mult of ['?', '*'] as const) for (const conEstado of tipo === 'efecto' ? [false] : [false, true])
        test(`T-128 T-194 B-42 ${tipo}/${mult}/estado=${conEstado}: opcional pospuesto e inversa`, () => {
            let m = modeloCon({ objetos: [['Pedido', ['activo']]], procesos: ['Procesar'] });
            const objeto = porNombre(m, 'Pedido'), proceso = porNombre(m, 'Procesar');
            if (objeto.tipo !== 'objeto') throw Error('Objeto');
            const candidato: EnlaceNuevo = tipo === 'efecto' ? { tipo, objeto: objeto.id, proceso: proceso.id, mult }
                : { tipo, objeto: objeto.id, proceso: proceso.id, mult, ...(conEstado ? { estado: objeto.estados[0]!.id } : {}) };
            const r = must(crearEnlace(m, { opd: m.raiz, candidato })); m = r.modelo;
            const antes = exportarV0(m), estado = conEstado ? ' en `activo`' : '';
            const o = (mult === '?' ? 'un ' : '') + '**Pedido**' + estado + (mult === '?' ? ' opcional' : ' opcionales');
            const esperado = tipo === 'agente' ? o.replace(/^un /, 'Un ') + ' maneja *Procesar*.'
                : '*Procesar* ' + ({ consumo: 'consume', resultado: 'genera', efecto: 'afecta', instrumento: 'requiere' } as const)[tipo] + ' ' + o + '.';
            const l = generarBloque(m, m.raiz).find(l => l.hechos.includes(r.creados[0]!))!;
            expect(l.texto).toBe(esperado);
            expect(l.tokens.some(t => t.rol === 'multiplicidad' && t.texto.includes('opcional'))).toBe(true);
            expect(analizar(l.texto)[0]!.diagnosticos).toEqual([]);
            const doc = generarDocumentoOpl(m), nuevo = must(importarOpl(m.nombre, doc));
            expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
            expect(Object.values(nuevo.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([mult]);
            expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
            expect(gatesExportacion(m, 'modelo')).toEqual([]); expect(exportarV0(m)).toBe(antes);
        });

for (const mult of ['?', '*'] as const)
    test(`T-119 T-128 T-194 B-42 etiquetado ${mult}: cola canónica, origen y destino propios`, () => {
        let m = modeloCon({ objetos: [['Origen', []], ['Destino', []]] });
        m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Origen').id,
            destino: porNombre(m, 'Destino').id, etiqueta: 'conoce', multOrigen: mult, multDestino: mult } })).modelo;
        const frase = mult === '?' ? 'Un **Origen** opcional «conoce» un **Destino** opcional.' : '**Origen** opcionales «conoce» **Destino** opcionales.';
        expect(generarBloque(m, m.raiz).filter(l => l.hechos.length).map(l => l.texto)).toEqual([frase]);
        const doc = generarDocumentoOpl(m), nuevo = must(importarOpl(m.nombre, doc));
        expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
        expect(Object.values(nuevo.modelo.enlaces).map(e => e.tipo === 'etiquetado' && [e.multOrigen, e.multDestino])).toEqual([[mult, mult]]);
    });

for (const tipo of ['agregacion', 'etiquetado', 'etiquetadoBidireccional', 'reciproco'] as const)
    test(`T-057 B-42 ${tipo} no cuantifica procesos y conserva la recuperación legacy`, () => {
        const base = modeloCon({ procesos: ['Preparar', 'Revisar'] }), a = porNombre(base, 'Preparar').id, b = porNombre(base, 'Revisar').id;
        const candidato: EnlaceNuevo = tipo === 'agregacion' ? { tipo, refinable: a, refinador: b }
            : tipo === 'etiquetadoBidireccional' ? { tipo, origen: a, destino: b, etiqueta: 'precede', inversa: 'sigue' }
                : { tipo, origen: a, destino: b, etiqueta: 'conecta' };
        const n = must(crearEnlace(base, { opd: base.raiz, candidato })), e = n.modelo.enlaces[n.creados[0]!]!;
        const extremo = tipo === 'agregacion' ? 'refinador' : 'destino', antes = exportarV0(n.modelo);
        const r = fijarMultiplicidad(n.modelo, { enlace: e.id, extremo, valor: '3' });
        expect(r.ok).toBe(false); if (r.ok) throw Error('Cantidad de proceso aceptada');
        expect(r.rechazo.regla).toBe('R-MULT-1A'); expect(exportarV0(n.modelo)).toBe(antes);
        const legado = { ...n.modelo, enlaces: { ...n.modelo.enlaces, [e.id]: { ...e, ...(tipo === 'agregacion' ? { mult: '3' as Multiplicidad } : { multDestino: '3' as Multiplicidad }) } } };
        expect(validarForma(legado)).toEqual([]);
        const json = exportarV0(legado), recuperado = importarV0(json);
        expect(recuperado.ok).toBe(true); if (!recuperado.ok) throw Error('Recuperación');
        expect(exportarV0(recuperado.modelo)).toBe(json);
        expect(gatesExportacion(recuperado.modelo, 'modelo').some(d => d.regla === 'R-MULT-1A')).toBe(true);
    });

for (const texto of ['*Procesar* consume un opcional **Pedido**.', '*Procesar* consume opcional (cero o más) **Pedido**.'])
    test(`T-150 T-194 B-42 entrada histórica preserva cantidad: ${texto}`, () => {
        const a = analizar(texto)[0]!; expect(a.diagnosticos).toEqual([]); expect(a.hechos).toHaveLength(1);
        const r = must(importarOpl('Prueba', '# Prueba\n\n## SD\n**Pedido** es físico.\n' + texto));
        const mult = texto.includes('cero o más') ? '*' : '?';
        expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([mult]);
        expect(generarDocumentoOpl(r.modelo)).toContain(mult === '?' ? 'un **Pedido** opcional' : '**Pedido** opcionales');
    });
