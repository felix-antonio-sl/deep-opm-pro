import { expect, test } from 'bun:test';
import { azar } from './pruebas/azar';
import { validarForma } from './nucleo/forma';
import { erroresContexto } from './nucleo/matriz';
import { aplicarAccion } from './nucleo/operaciones';
import { proyectar } from './nucleo/proyeccion';
import { diagnosticar, gatesExportacion } from './nucleo/diagnostico';
import { escena } from './opd/escena';
import { dibujar } from './opd/dibujo';
import { generarModelo } from './opl/generar';
import { generarDocumentoOpl, importarOpl } from './opl/documento';
import { PLANTILLAS } from './opl/plantillas';
import { casosRoundtrip, type EntradaCorpus, type EsperarCorpus } from './pruebas/corpus-roundtrip';
import { modeloCon } from './pruebas/constructores';
import type { Modelo } from './nucleo/tipos';
import { planificar } from './opl/planificar';
import { importarV0 } from './codec/importar';
import { exportarV0 } from './codec/exportar';

const SEMILLA_HODOM = 19450;
test('WP-10 DESIGN §2.4 perfil HODOM real, exacto, determinista y válido', () => {
    const m = azar(SEMILLA_HODOM, 'hodom'), antes = JSON.stringify(m);
    expect([Object.keys(m.cosas).length, Object.values(m.cosas).flatMap(c => c.tipo === 'objeto' ? c.estados : []).length,
        Object.keys(m.enlaces).length, Object.keys(m.opds).length]).toEqual([262, 192, 433, 36]);
    expect(validarForma(m)).toEqual([]);
    expect(erroresContexto(m)).toEqual([]);
    expect(gatesExportacion(m, 'modelo')).toEqual([]);
    expect(Object.values(m.opds).every(o => Object.keys(o.apariciones).length <= 25)).toBe(true);
    expect(JSON.stringify(azar(SEMILLA_HODOM, 'hodom'))).toBe(antes);
    expect(JSON.stringify(azar(SEMILLA_HODOM + 1, 'hodom'))).not.toBe(antes);
    expect(JSON.stringify(m)).toBe(antes);
});

// Calentamiento independiente y mediana de cinco trabajos sobre identidades nuevas.
// Preparar/comprobar quedan fuera del reloj; nunca se reutiliza una respuesta cacheada.
function medir<T>(meta: string, limite: number, preparar: () => () => T, comprobar: (r: T) => void) {
    const calentamiento = preparar();
    comprobar(calentamiento());
    const medidas: number[] = [];
    for (let muestra = 0; muestra < 5; muestra++) {
        const trabajo = preparar(), inicio = performance.now(), r = trabajo(), ms = performance.now() - inicio;
        comprobar(r);
        medidas.push(ms);
    }
    const mediana = medidas.sort((a, b) => a - b)[2]!;
    expect(mediana, `${meta}/mediana de cinco identidades frescas`).toBeLessThan(limite);
    return { mediana, medidas };
}
test('WP-10 DESIGN §2.4 operación nuclear efectiva incluye cierre DS20 <9ms', () => {
    medir('operación DS20', 9, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => aplicarAccion(m, { op: 'renombrarModelo', args: { nombre: 'HODOM actualizado' } }); }, r => {
        expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r));
        expect(r.valor.modelo.nombre).toBe('HODOM actualizado'); expect(validarForma(r.valor.modelo)).toEqual([]); expect(erroresContexto(r.valor.modelo)).toEqual([]);
    });
});
test('WP-10 DESIGN §2.4 proyectar OPD real <9ms', () => {
    medir('proyectar', 9, () => { const m = azar(SEMILLA_HODOM, 'hodom'), opd = Object.values(m.opds).find(o => o.tipo === 'descomposicion' && o.objetosInternos.length)!; return () => proyectar(m, opd.id); }, r => { expect(r.cosas.length).toBe(9); expect(r.enlaces.length).toBeGreaterThan(0); });
});
test('WP-10 DESIGN §2.4 escena y dibujo OPD≤25 en modelo completo <15ms', () => {
    medir('escena+dibujar', 15, () => { const m = azar(SEMILLA_HODOM, 'hodom'), opd = Object.values(m.opds).find(o => o.tipo === 'descomposicion' && o.objetosInternos.length)!; expect(Object.keys(opd.apariciones).length).toBe(9); return () => dibujar(escena(m, opd.id), 'canon'); }, r => { expect(r.t).toBe('g'); expect(r.h!.length).toBeGreaterThan(0); });
});
test('WP-10 DESIGN §2.4 generarModelo36 bloques <75ms', () => {
    medir('generarModelo', 75, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => generarModelo(m); }, r => { expect(new Set(r.map(l => l.opd)).size).toBe(36); });
});
test('WP-10 DESIGN §2.4 diagnosticar modelo completo <90ms', () => {
    medir('diagnosticar', 90, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => diagnosticar(m); }, r => { expect(r.filter(d => d.severidad === 'error')).toEqual([]); });
});
test('T-287 WP-10 importarV0 completo <450ms', () => {
    medir('importarV0', 450, () => { const json = exportarV0(azar(SEMILLA_HODOM, 'hodom')); return () => importarV0(json); }, r => { expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r)); expect(Object.keys(r.modelo.enlaces).length).toBe(433); expect(r.informe.descartado).toEqual([]); });
});
test('T-286 WP-10 exportarV0 completo <60ms', () => {
    medir('exportarV0', 60, () => { const m = azar(SEMILLA_HODOM, 'hodom'); return () => exportarV0(m); }, r => { expect(r.endsWith('\n')).toBe(true); expect(Object.keys(JSON.parse(r).modelo.entidades).length).toBe(262); });
});
test('WP-10 DESIGN §2.4 planificar1000 líneas genuinas <180ms', () => {
    medir('planificar1000', 180, () => {
        const m = azar(SEMILLA_HODOM, 'hodom'), originales = generarDocumentoOpl(m).split('\n').filter(l => l.trim());
        const lineas = Array.from({ length: 1000 }, (_, i) => originales[i % originales.length]!);
        expect(lineas).toHaveLength(1000); const texto = lineas.join('\n');
        return () => planificar(m, 'modelo', texto);
    }, r => { expect(r.lineas).toHaveLength(1000); expect(r.acciones).toEqual([]); expect(r.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error'))).toEqual([]); });
});

// Cada preparación crea colecciones y callbacks nuevos. Toda construcción de modelos,
// enumeración, análisis, ensayo, importación y regeneración ocurre dentro del trabajo.
// Los oráculos se recogen y comprueban después del reloj; ninguna respuesta se retiene.
function prepararCorpusRoundtrip() {
    const comprobaciones: (() => void)[] = [], libro: EntradaCorpus[] = [];
    const pendientes: { nombre: string; id: string; doc: string; clave: string }[] = [];
    const argumentosExactos = new Set<string>(), plantillas = new Set(PLANTILLAS.map(p => p.id));
    let modelos = 0, importaciones = 0;
    const esperar: EsperarCorpus = actual => ({
        toEqual: esperado => { comprobaciones.push(() => { expect(actual).toEqual(esperado); }); },
        toBe: esperado => { comprobaciones.push(() => { expect(actual).toBe(esperado); }); },
        toBeGreaterThan: esperado => { comprobaciones.push(() => { expect(actual).toBeGreaterThan(esperado); }); },
        toHaveLength: esperado => { comprobaciones.push(() => { expect(actual).toHaveLength(esperado); }); },
        toBeNull: () => { comprobaciones.push(() => { expect(actual).toBeNull(); }); },
    });
    const verificar = (m: Modelo, id: string, estricto = true) => {
        modelos++;
        const doc = generarDocumentoOpl(m), p = planificar(m, 'modelo', doc);
        esperar({ id, errores: p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error')) }).toEqual({ id, errores: [] });
        esperar({ id, acciones: p.acciones }).toEqual({ id, acciones: [] });
        esperar(generarModelo(m).every(l => l.soloDisplay || plantillas.has(l.plantilla))).toBe(true);
        if (estricto) pendientes.push({ nombre: m.nombre, id, doc, clave: JSON.stringify([m.nombre, doc]) });
    };
    const casos = casosRoundtrip(verificar, esperar, libro);
    return () => {
        for (const caso of casos) caso.ejecutar();
        for (const { nombre, id, doc, clave } of pendientes) {
            const r = importarOpl(nombre, doc); // Real en cada ocurrencia: sin retención ni respuesta cacheada.
            importaciones++;
            argumentosExactos.add(clave);
            esperar({ id, ok: r.ok }).toEqual({ id, ok: true });
            if (!r.ok) continue;
            esperar(r.valor.plan.resumen.noAplicables).toBe(0);
            esperar({ id, texto: generarDocumentoOpl(r.valor.modelo) }).toEqual({ id, texto: doc });
        }
        // También se conserva el trabajo intercalado de la guarda de factorización.
        const b = modeloCon({ objetos: [['Pedido', []]], procesos: ['Validar'], enlaces: [['consumo', 'Pedido', 'Validar']] });
        const antes = JSON.stringify(b), doc = generarDocumentoOpl(b), r = importarOpl(b.nombre, doc);
        esperar(r.ok).toBe(true);
        const respuestaAntes = JSON.stringify(r);
        for (let i = 0; i < 8; i++) esperar(importarOpl('Otra', `**Objeto_${i}** es físico.`).ok).toBe(true);
        const otra = importarOpl(b.nombre, doc);
        esperar(otra.ok).toBe(true);
        if (r.ok && otra.ok) {
            esperar(generarDocumentoOpl(otra.valor.modelo)).toBe(doc);
            esperar(otra.valor.modelo === r.valor.modelo).toBe(false);
            esperar(JSON.stringify(r)).toBe(respuestaAntes);
            esperar(JSON.stringify(b)).toBe(antes);
        }
        return { casos: casos.length, modelos, importaciones, pendientes: pendientes.length,
            argumentosExactos: argumentosExactos.size, admitidos: libro.filter(c => c.admitido).length,
            familias: [...new Set(libro.map(c => c.familia))].sort(), comprobaciones };
    };
}

test('T-192 toda enumeración construcción análisis ensayo aplicación mediana <3000ms', () => {
    const medidas = medir('T-192 corpus completo', 3000, prepararCorpusRoundtrip, r => {
        for (const comprobar of r.comprobaciones) comprobar();
        expect(r.casos).toBe(160);
        expect(r.modelos).toBe(2996);
        expect(r.admitidos).toBe(r.modelos);
        expect(r.argumentosExactos).toBe(2734);
        expect(r.importaciones).toBe(r.pendientes);
        expect(r.familias).toEqual(['CX', 'CX3', 'EX', 'FAN5', 'atributos-mixtos', 'atómico', 'fan', 'fan-por-rama']);
    });
    console.log('T-192 rendimiento corpus completo', medidas);
}, 30000); // Timeout técnico de seis corpus; el umbral de la mediana sigue siendo 3000ms.
