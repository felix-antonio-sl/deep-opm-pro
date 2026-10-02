import { test, expect, afterEach, mock } from 'bun:test';
import { modeloCon, congelar } from '../pruebas/constructores';
import { extremos, esProcedimental } from './tipos';
import { EXPECTATIVAS_MATRIZ } from '../pruebas/expectativas-matriz';
const aislado = process.env.OPFORJA_WP1_AISLADO === 'indice';
function caso(nombre: string, cuerpo: () => void): void {
    test(nombre, aislado ? cuerpo : () => {
        const filtro = '^' + nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$';
        const p = Bun.spawnSync([process.execPath, '--no-env-file', 'test', import.meta.path, '-t', filtro], { env: { ...process.env, OPFORJA_WP1_AISLADO: 'indice' } });
        expect(p.exitCode, new TextDecoder().decode(p.stdout) + new TextDecoder().decode(p.stderr)).toBe(0);
    });
}
if (aislado)
    mock.module('./matriz', () => ({ MATRIZ: EXPECTATIVAS_MATRIZ, noOfrecido: () => null }));
const { indice, claveNombre, buscarPorNombre, describirEnlace } = await import('./indice');
const { validarForma } = await import('./forma');
let modelos: ReturnType<typeof modeloCon>[] = [];
afterEach(() => {
    for (const m of modelos)
        expect(validarForma(m)).toEqual([]);
    modelos = [];
});
caso('T-022 índice conserva ids y memoiza solo por identidad', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]], procesos: ['Despachar'], enlaces: [['consumo', 'Pedido', 'Despachar']] });
    modelos.push(m);
    congelar(m);
    const idx = indice(m);
    expect(indice(m)).toBe(idx);
    expect(indice({ ...m })).not.toBe(idx);
    const o = Object.values(m.cosas).find(c => c.tipo === 'objeto')!;
    const e = Object.values(m.enlaces)[0]!;
    expect(idx.enlacesDeCosa.get(o.id)).toEqual([e.id]);
    expect(idx.aparicionesDe.get(o.id)).toEqual([m.raiz]);
    expect(esProcedimental(e)).toBe(true);
    expect(extremos(e).origen).toBe(o.id);
});
caso('T-025 clave nominal conserva acentos y normaliza NFC, espacios y mayúsculas', () => { expect(claveNombre('  Álfa   Uno  ')).toBe('álfa uno'); expect(claveNombre('Alfa')).not.toBe(claveNombre('Álfa')); });
caso('T-100 índice calcula árbol, apariciones, refinamientos y alcance en preorden', () => {
    const base = modeloCon({ objetos: [['Alfa', ['uno']]], procesos: ['Contener', 'Segundo', 'Interno'] });
    const id = (nombre: string) => Object.values(base.cosas).find(c => c.nombre === nombre)!.id;
    const caja = { x: 0, y: 0, ancho: 135, alto: 60 };
    const { [id('Interno')]: omitido, ...apariciones } = base.opds[base.raiz]!.apariciones;
    void omitido;
    const m = congelar({ ...base, secuencia: 103, opds: { [base.raiz]: { ...base.opds[base.raiz]!, apariciones }, 'opd-101': { id: 'opd-101', tipo: 'despliegue' as const, padre: base.raiz, cosa: id('Alfa'), orden: 1, modo: 'agregacion' as const, apariciones: { [id('Alfa')]: caja } }, 'opd-100': { id: 'opd-100', tipo: 'descomposicion' as const, padre: base.raiz, cosa: id('Contener'), orden: 0, bandas: [[id('Interno')]], objetosInternos: [], apariciones: { [id('Contener')]: caja, [id('Interno')]: caja } } } });
    modelos.push(m);
    const i = indice(m);
    expect(i.preorden).toEqual([base.raiz, 'opd-100', 'opd-101']);
    expect(i.etiqueta.get('opd-100')).toBe('SD1');
    expect(i.etiqueta.get('opd-101')).toBe('SD2');
    expect(i.aparicionesDe.get(id('Contener'))).toEqual([base.raiz, 'opd-100']);
    expect(i.refinamientosDe.get(id('Alfa'))).toEqual({ despliegue: 'opd-101' });
    expect(i.internoDe.get(id('Interno'))).toBe('opd-100');
    expect(i.subprocesoDe.get(id('Interno'))).toEqual({ opd: 'opd-100', banda: 0 });
});
caso('T-025 índice busca sin acentos, incluye estados, limita resultados y describe enlaces', () => {
    const m = modeloCon({ objetos: [['Árbol', ['húmedo']]], procesos: ['Regar'], enlaces: [['instrumento', 'Árbol', 'Regar']] });
    modelos.push(m);
    const o = Object.values(m.cosas).find(c => c.tipo === 'objeto')!, e = Object.values(m.enlaces)[0]!;
    expect(buscarPorNombre(m, 'ARBOL')).toEqual([{ ref: { tipo: 'cosa', id: o.id }, texto: 'Árbol', detalle: 'objeto · SD' }]);
    const estados = buscarPorNombre(m, 'humedo');
    expect(estados[0]?.ref.tipo).toBe('estado');
    expect(buscarPorNombre(m, 'ausente')).toEqual([]);
    expect(buscarPorNombre(m, '', 1).length).toBe(1);
    expect(describirEnlace(m, e)).toBe('instrumento: Árbol → Regar');
    const i = indice(m);
    if (o.tipo === 'objeto') {
        expect(i.estadoDe.get(o.estados[0]!.id)).toEqual({ objeto: o.id, posicion: 0 });
    }
});
