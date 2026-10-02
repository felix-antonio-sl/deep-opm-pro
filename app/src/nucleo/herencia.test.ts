import { test, expect, afterEach, mock } from 'bun:test';
import { generales } from './herencia';
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
