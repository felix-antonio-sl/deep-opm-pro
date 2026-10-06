import { test, expect, mock, afterEach } from 'bun:test';
import { azar } from './azar';
import { EXPECTATIVAS_MATRIZ } from './expectativas-matriz';
import { modeloCon } from './constructores';
import type { TipoEnlace, Modelo } from '../nucleo/tipos';
const aislado = process.env.OPFORJA_WP1_AISLADO === 'azar';
function caso(nombre: string, cuerpo: () => void): void {
    test(nombre, aislado ? cuerpo : () => {
        const filtro = '^' + nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$';
        const p = Bun.spawnSync([process.execPath, '--no-env-file', 'test', import.meta.path, '-t', filtro], { env: { ...process.env, OPFORJA_WP1_AISLADO: 'azar' } });
        expect(p.exitCode, new TextDecoder().decode(p.stdout) + new TextDecoder().decode(p.stderr)).toBe(0);
    });
}
if (aislado)
    mock.module('../nucleo/matriz', () => ({ MATRIZ: EXPECTATIVAS_MATRIZ, noOfrecido: () => null }));
const { validarForma } = await import('../nucleo/forma');
const modelos: Modelo[] = [];
afterEach(() => {
    for (const m of modelos)
        expect(validarForma(m)).toEqual([]);
    modelos.length = 0;
});
caso('T-040 azar: dos perfiles, 200 semillas válidas, reproducibles y no idénticas', () => {
    const distintos = new Set<string>();
    for (let i = 0; i < 200; i++)
        for (const perfil of ['estricto', 'completo'] as const) {
            const m = azar(i, perfil);
            modelos.push(m);
            expect(validarForma(m)).toEqual([]);
            expect(azar(i, perfil)).toEqual(m);
            expect(Object.isFrozen(m)).toBe(true);
            distintos.add(JSON.stringify(m));
        }
    expect(distintos.size).toBeGreaterThan(100);
});
caso('T-040 constructores cubren cada uno de los 15 tipos sin operaciones', () => {
    const tipos = Object.keys(EXPECTATIVAS_MATRIZ) as TipoEnlace[];
    expect(tipos.length).toBe(15);
    const vistos = new Set<TipoEnlace>();
    for (const tipo of tipos) {
        const fila = EXPECTATIVAS_MATRIZ[tipo];
        const a = fila.clases[0] === 'proceso' ? 'Primero' : 'Alfa', b = fila.clases[1] === 'proceso' ? 'Segundo' : 'Beta';
        const m = modeloCon({ objetos: [['Alfa', ['uno']], ['Beta', ['dos']]], procesos: ['Primero', 'Segundo'], enlaces: [[tipo, a, b]] });
        modelos.push(m);
        expect(validarForma(m)).toEqual([]);
        vistos.add(Object.values(m.enlaces)[0]!.tipo);
    }
    expect(vistos).toEqual(new Set(tipos));
});

test('T-040 azar.acciones conserva API/modelos WP1 y ofrece acciones reales reproducibles sin mutación', async () => {
    expect(typeof azar.acciones).toBe('function');
    const { aplicarAccion } = await import('../nucleo/operaciones');
    const m = azar(12, 'completo'), antes = JSON.stringify(m), acciones = azar.acciones(m);
    expect(acciones).toEqual(azar.acciones(m)); expect(acciones.length).toBeGreaterThan(0);
    expect(acciones.some(a => a.op === 'descomponer')).toBe(true); expect(acciones.some(a => a.op === 'desplegar')).toBe(true);
    for (const accion of acciones) { const r = aplicarAccion(m, accion); if (r.ok) expect(validarForma(r.valor.modelo)).toEqual([]); expect(JSON.stringify(m)).toBe(antes); }
    expect(azar(12, 'completo')).toEqual(m);
});
