import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace } from '../nucleo/enlaces';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { generarBloque } from './generar';
import { analizar } from './analizar';
import { planificar } from './planificar';

for (const miembros of [2, 3, 4])
    test(`T-057 T-133 T-192 B-56 ${miembros} consumos AND conservan parámetros, tokens y hechos propios`, () => {
        const nombres = ['Alfa', 'Beta', 'Gamma', 'Omega'].slice(0, miembros), cantidades = ['consume', 'genera', 'requiere', 'XOR'];
        let m = modeloCon({ objetos: nombres.map(n => [n, ['activo']] as const), procesos: ['Procesar'] });
        for (const [i, nombre] of nombres.entries()) {
            const objeto = porNombre(m, nombre); if (objeto.tipo !== 'objeto') throw Error('Objeto');
            m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: objeto.id,
                proceso: porNombre(m, 'Procesar').id, mult: cantidades[i]!, estado: objeto.estados[0]!.id } })).modelo;
        }
        expect(gatesExportacion(m, 'modelo')).toEqual([]);
        const json = exportarV0(m), lineas = generarBloque(m, m.raiz).filter(l => l.hechos.length);
        expect(lineas).toHaveLength(1); const l = lineas[0]!; expect(l.plantilla).toBe('AND-consumo');
        expect(new Set(l.hechos)).toEqual(new Set(Object.keys(m.enlaces)));
        for (const e of Object.values(m.enlaces)) {
            if (e.tipo !== 'consumo') throw Error('Firma');
            expect(l.tokens.some(t => t.texto === e.mult && t.rol === 'multiplicidad')).toBe(true);
            expect(l.tokens.some(t => t.ref?.id === e.objeto && t.hecho === e.id)).toBe(true);
            expect(l.tokens.some(t => t.ref?.id === e.estado && t.hecho === e.id)).toBe(true);
            expect(l.texto).toContain('«' + e.mult + '» **' + m.cosas[e.objeto]!.nombre + '** en `activo`');
        }
        const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc)); expect(r.plan.resumen.noAplicables).toBe(0);
        const firma = (x: typeof m) => Object.values(x.enlaces).map(e => {
            if (e.tipo !== 'consumo') throw Error('Firma');
            const o = x.cosas[e.objeto]; if (o?.tipo !== 'objeto') throw Error('Objeto');
            return [o.nombre, x.cosas[e.proceso]!.nombre, e.mult, o.estados.find(s => s.id === e.estado)?.nombre];
        }).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
        expect(firma(r.modelo)).toEqual(firma(m)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
        expect(planificar(m, 'modelo', doc).acciones).toEqual([]); expect(exportarV0(m)).toBe(json);
        const fijo = importarV0(json); expect(fijo.ok).toBe(true); if (!fijo.ok) throw Error('Códec');
        expect(exportarV0(fijo.modelo)).toBe(json);
    });

for (const etiqueta of [undefined, 'genera', 'n', 'conoce n'] as const)
    test(`T-119 T-128 T-182 T-192 B-56 etiqueta ${etiqueta ?? 'default'} y parámetros adyacentes no intercambian roles`, () => {
        let m = modeloCon({ objetos: [['Origen', []], ['Destino', []], ['Otro', []]] });
        for (const [destino, mult] of [['Destino', 'N'], ['Otro', 'Ñ2']] as const)
            m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Origen').id,
                destino: porNombre(m, destino).id, ...(etiqueta ? { etiqueta } : {}), multOrigen: 'n', multDestino: mult } })).modelo;
        const json = exportarV0(m), lineas = generarBloque(m, m.raiz).filter(l => l.hechos.length);
        expect(lineas).toHaveLength(1); const l = lineas[0]!;
        expect(l.texto).toBe('«n» **Origen** «' + (etiqueta ?? 'se relaciona con') + '» «N» **Destino** y «Ñ2» **Otro**.');
        expect(l.tokens.filter(t => t.rol === 'multiplicidad').map(t => t.texto)).toEqual(['n', 'N', 'Ñ2']);
        expect(l.tokens.find(t => t.ref?.tipo === 'enlace')?.texto).toBe(etiqueta ?? 'se relaciona con');
        const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc)); expect(r.plan.resumen.noAplicables).toBe(0);
        expect(Object.values(r.modelo.enlaces).map(e => {
            if (e.tipo !== 'etiquetado') throw Error('Firma');
            return [r.modelo.cosas[e.origen]!.nombre, r.modelo.cosas[e.destino]!.nombre, e.etiqueta ?? 'se relaciona con', e.multOrigen, e.multDestino];
        })).toEqual([['Origen', 'Destino', etiqueta ?? 'se relaciona con', 'n', 'N'], ['Origen', 'Otro', etiqueta ?? 'se relaciona con', 'n', 'Ñ2']]);
        expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]); expect(exportarV0(m)).toBe(json);
    });

for (const texto of ['*Procesar* consume n **Alfa**.', 'AND **Alfa** maneja *Procesar*.',
    '**Alfa** conoce «N» **Beta**.'])
    test(`T-150 T-192 B-56 legacy unívoco conserva el parámetro: ${texto}`, () => {
        const l = analizar(texto)[0]!; expect(l.diagnosticos).toEqual([]); expect(l.hechos).toHaveLength(1);
        const r = must(importarOpl('Prueba', '# Prueba\n\n## SD\n**Alfa** es físico.\n' + texto)); expect(r.plan.resumen.noAplicables).toBe(0);
        const e = Object.values(r.modelo.enlaces)[0]!;
        expect(e.tipo === 'etiquetado' ? e.multDestino : 'mult' in e ? e.mult : undefined).toBe(texto.startsWith('AND') ? 'AND' : texto.startsWith('**') ? 'N' : 'n');
        expect(generarDocumentoOpl(r.modelo)).toContain('«');
    });

for (const parametro of ['opcional', 'opcionales', 'unopcional', 'Opcionalidad', 'opcionales2'])
    test(`T-057 T-150 T-192 B-56 legacy unívoco no convierte parte del símbolo ${parametro} en opcionalidad`, () => {
        const texto = '*Procesar* consume ' + parametro + ' **Alfa**.', l = analizar(texto)[0]!;
        expect(l.diagnosticos).toEqual([]);
        expect(l.hechos).toEqual([{ k: 'enlace', enlace: { tipo: 'consumo', objeto: { nombre: 'Alfa', tipo: 'objeto', mult: parametro }, proceso: 'Procesar' } }]);
        const r = must(importarOpl('Prueba', '# Prueba\n\n## SD\n' + texto));
        expect(r.plan.resumen.noAplicables).toBe(0);
        expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([parametro]);
        expect(generarDocumentoOpl(r.modelo)).toContain('«' + parametro + '» **Alfa**');
    });

for (const cantidad of ['«n', 'n»', '««n»', '«n»»', '«n»«N»', '«n + 1»', '«2..5»', '«n>=1»', '«NaN»', '«Infinity»', '«un»', '«muchos»', '«»'])
    test(`T-150 T-173 B-56 DEC55 cantidad histórica completa o delimitador inválido: ${cantidad}`, () => {
        const base = modeloCon({ objetos: [['Alfa', []]], procesos: ['Procesar'] }), json = exportarV0(base);
        const texto = '*Procesar* consume ' + cantidad + ' **Alfa**.', l = analizar(texto)[0]!;
        expect(l.texto).toBe(texto);
        const nuevas: Record<string, string> = { '«n + 1»': 'n+1', '«2..5»': '2..5', '«NaN»': 'NaN', '«Infinity»': 'Infinity', '«un»': 'un' };
        if (Object.hasOwn(nuevas, cantidad)) {
            expect(l.diagnosticos).toEqual([]); expect(l.hechos).toHaveLength(1);
            const r = must(importarOpl(base.nombre, '# Prueba\n\n## SD\n' + texto));
            expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([nuevas[cantidad]]);
            expect(planificar(base, base.raiz, texto).acciones.length).toBeGreaterThan(0);
            const emitido = generarDocumentoOpl(r.modelo); expect(planificar(r.modelo, 'modelo', emitido).acciones).toEqual([]);
        } else {
            expect(l.hechos).toEqual([]); expect(l.diagnosticos.length).toBeGreaterThan(0);
            expect(planificar(base, base.raiz, texto).acciones).toEqual([]);
        }
        expect(exportarV0(base)).toBe(json);
    });
