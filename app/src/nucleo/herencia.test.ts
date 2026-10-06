import { test, expect, afterEach, mock } from 'bun:test';
import { generales } from './herencia';
import { azar } from '../pruebas/azar';
import { modeloCon, porNombre } from '../pruebas/constructores';
import { EXPECTATIVAS_MATRIZ } from '../pruebas/expectativas-matriz';
const limpio = modeloCon();
const aislado = process.env.OPFORJA_WP1_AISLADO === 'herencia';
if (aislado)
    mock.module('./matriz', () => ({ MATRIZ: EXPECTATIVAS_MATRIZ, noOfrecido: () => null }));
const { validarForma } = await import('./forma');
const modelos = [limpio];
afterEach(() => {
    for (const m of modelos)
        expect(validarForma(m)).toEqual([]);
});
test('T-093 cierre transitivo de herencia múltiple sin repetir ni incluir origen en ciclos', aislado ? () => {
    const m = modeloCon({ objetos: [['Alfa', []], ['Beta', []], ['Gamma', []], ['Delta', []]], enlaces: [['generalizacion', 'Alfa', 'Beta'], ['generalizacion', 'Alfa', 'Gamma'], ['generalizacion', 'Beta', 'Delta'], ['generalizacion', 'Gamma', 'Delta'], ['generalizacion', 'Delta', 'Alfa']] });
    modelos.push(m);
    const id = (n: string) => porNombre(m, n).id;
    expect(new Set(generales(m, id('Delta')))).toEqual(new Set([id('Alfa'), id('Beta'), id('Gamma')]));
    expect(generales(m, id('Delta'))).not.toContain(id('Delta'));
    expect(generales(limpio, 'ausente')).toEqual([]);
} : () => { const p = Bun.spawnSync([process.execPath, '--no-env-file', 'test', import.meta.path], { env: { ...process.env, OPFORJA_WP1_AISLADO: 'herencia' } }); expect(p.exitCode, new TextDecoder().decode(p.stdout) + new TextDecoder().decode(p.stderr)).toBe(0); });

test('T-093 incidencia conserva DFS previo, orden, herencia múltiple y ciclos', () => {
    function previo(m: import('./tipos').Modelo, cosa: string): readonly string[] {
        const vistos = new Set([cosa]), lista: string[] = [];
        const visitar = (id: string) => {
            for (const e of Object.values(m.enlaces)) {
                if (e.tipo === 'generalizacion' && e.refinador === id && !vistos.has(e.refinable)) {
                    vistos.add(e.refinable); lista.push(e.refinable); visitar(e.refinable);
                }
            }
        };
        visitar(cosa); return lista;
    }
    const grafo = modeloCon({ objetos: [['Alfa', []], ['Beta', []], ['Gamma', []], ['Delta', []]], enlaces: [
        ['generalizacion', 'Alfa', 'Beta'], ['generalizacion', 'Gamma', 'Beta'],
        ['generalizacion', 'Delta', 'Alfa'], ['generalizacion', 'Beta', 'Delta'], ['agregacion', 'Beta', 'Gamma']
    ] });
    const variantes = [grafo, { ...grafo, enlaces: Object.fromEntries(Object.entries(grafo.enlaces).reverse()) }, azar(19450, 'hodom')];
    for (let s = 0; s < 200; s++) variantes.push(azar(s, s % 2 ? 'estricto' : 'completo'));
    for (const m of variantes) {
        const antes = JSON.stringify(m);
        for (const id of [...Object.keys(m.cosas), 'ausente']) expect(generales(m, id)).toEqual(previo(m, id));
        expect(JSON.stringify(m)).toBe(antes);
    }
    const ids = (n: string) => porNombre(grafo, n).id;
    expect(generales(grafo, ids('Beta'))).toEqual([ids('Alfa'), ids('Delta'), ids('Gamma')]);
});

// Control GREEN-first de la guarda WP-12: ausencia de salida y SELF no inventan ancestros.
test('T-093 ausencia, SELF y ciclos preservan orden completo sin contaminar otra consulta', () => {
    const b = modeloCon({ objetos: [['Alfa', []], ['Beta', []], ['Gamma', []]],
        enlaces: [['agregacion', 'Alfa', 'Beta']] });
    const [a, beta, g] = ['Alfa', 'Beta', 'Gamma'].map(n => porNombre(b, n).id);
    const propio = { ...b, enlaces: { ...b.enlaces,
        self: { id: 'self', tipo: 'generalizacion' as const, refinable: a!, refinador: a! } } };
    // SELF es un dato diagnóstico para el helper, no una oferta de crear generalización reflexiva.
    const ciclo = { ...propio, enlaces: { ...propio.enlaces,
        primero: { id: 'primero', tipo: 'generalizacion' as const, refinable: beta!, refinador: a! },
        segundo: { id: 'segundo', tipo: 'generalizacion' as const, refinable: g!, refinador: beta! },
        cierre: { id: 'cierre', tipo: 'generalizacion' as const, refinable: a!, refinador: g! } } };
    const antes = JSON.stringify([b, propio, ciclo]);
    expect(generales(b, a!)).toEqual([]); expect(generales(propio, a!)).toEqual([]);
    expect(generales(ciclo, a!)).toEqual([beta!, g!]);
    expect(generales(ciclo, g!)).toEqual([a!, beta!]);
    expect(generales(ciclo, 'ausente')).toEqual([]);
    expect(generales(propio, a!)).toEqual([]); expect(generales(b, beta!)).toEqual([]);
    expect(JSON.stringify([b, propio, ciclo])).toBe(antes);
});
