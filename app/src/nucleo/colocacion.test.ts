import { test, expect, afterEach } from 'bun:test';
import { colocar } from './colocacion';
import { modeloCon } from '../pruebas/constructores';
import { validarForma } from './forma';
const m = modeloCon({ objetos: [['Alfa', []], ['Beta', []]] });
let modeloValidado: Modelo = m;
afterEach(() => { expect(validarForma(modeloValidado)).toEqual([]); modeloValidado = m; });
test('T-226 colocación determinista encuentra hueco con margen y vacío al origen', () => {
    expect(colocar(modeloCon(), 'opd-1', { ancho: 135, alto: 60 })).toEqual({ x: 0, y: 0 });
    const p = colocar(m, m.raiz, { ancho: 135, alto: 60 }, { x: 0, y: 0 });
    expect(colocar(m, m.raiz, { ancho: 135, alto: 60 }, { x: 0, y: 0 })).toEqual(p);
    for (const a of Object.values(m.opds[m.raiz]!.apariciones))
        expect(p.x + 135 + 24 <= a.x || p.x >= a.x + a.ancho + 24 || p.y + 60 + 24 <= a.y || p.y >= a.y + a.alto + 24).toBe(true);
});
import { colocarDescomposicion, colocarDespliegue } from './colocacion';
import type { Modelo, OpdDescomposicion, OpdDespliegue } from './tipos';
import { porNombre, congelar } from '../pruebas/constructores';
const noSolapes = (cajas: ReturnType<typeof colocarDescomposicion>, contenedor: string) => {
    const cajasSin = Object.entries(cajas).filter(([id]) => id !== contenedor);
    for (let i = 0; i < cajasSin.length; i++)
        for (let j = i + 1; j < cajasSin.length; j++) {
            const a = cajasSin[i]![1], b = cajasSin[j]![1];
            expect(a.x + a.ancho <= b.x || b.x + b.ancho <= a.x || a.y + a.alto <= b.y || b.y + b.alto <= a.y).toBe(true);
        }
};
test('T-226 descomposición coloca contenedor, bandas, internos y grupos externos sin solapes', () => { const base = modeloCon({ objetos: [['Entrada', []], ['Salida', []], ['Agente', []], ['Rasgo', []], ['Interno', []]], procesos: ['Contener', 'Primero', 'Segundo', 'Tercero', 'Externo'], enlaces: [['consumo', 'Entrada', 'Primero'], ['resultado', 'Salida', 'Tercero'], ['agente', 'Agente', 'Segundo']] }); const id = (n: string) => porNombre(base, n).id; const apariciones = base.opds[base.raiz]!.apariciones; const o: OpdDescomposicion = congelar({ id: 'opd-100', tipo: 'descomposicion', padre: base.raiz, cosa: id('Contener'), orden: 0, bandas: [[id('Primero'), id('Segundo')], [id('Tercero')]], objetosInternos: [id('Interno')], apariciones }); const cajas = colocarDescomposicion(base, o), c = cajas[o.cosa]!; expect(c.ancho).toBeGreaterThanOrEqual(420); expect(c.alto).toBe(388); expect(cajas[id('Primero')]!.y).toBe(c.y + 64); expect(cajas[id('Segundo')]!.y).toBe(c.y + 64); expect(cajas[id('Tercero')]!.y).toBe(c.y + 164); expect(cajas[id('Interno')]!.y).toBe(c.y + 264); expect(cajas[id('Entrada')]!.x).toBeLessThan(c.x); expect(cajas[id('Salida')]!.x).toBeGreaterThan(c.x + c.ancho); expect(cajas[id('Agente')]!.y).toBeLessThan(c.y); expect(cajas[id('Rasgo')]!.y).toBeGreaterThan(c.y + c.alto); expect(cajas[id('Externo')]!.y).toBeGreaterThan(c.y + c.alto); noSolapes(cajas, o.cosa); expect(colocarDescomposicion(base, o)).toEqual(cajas); expect(o.apariciones).toBe(apariciones); });
test('T-226 despliegue ordena refinadores por nombre 180px debajo y centrados', () => { const base = modeloCon({ objetos: [['Todo', []], ['Beta', []], ['Alfa', []]], enlaces: [['agregacion', 'Todo', 'Beta'], ['agregacion', 'Todo', 'Alfa']] }); const id = (n: string) => porNombre(base, n).id; const o: OpdDespliegue = congelar({ id: 'opd-100', tipo: 'despliegue', padre: base.raiz, cosa: id('Todo'), orden: 0, modo: 'agregacion', apariciones: base.opds[base.raiz]!.apariciones }); const c = colocarDespliegue(base, o); expect(c[id('Alfa')]!.x).toBeLessThan(c[id('Beta')]!.x); expect(c[id('Alfa')]!.y).toBe(c[id('Todo')]!.y + 180); expect(Math.abs((c[id('Alfa')]!.x + c[id('Beta')]!.x + c[id('Beta')]!.ancho) / 2 - (c[id('Todo')]!.x + c[id('Todo')]!.ancho / 2))).toBeLessThanOrEqual(0.5); noSolapes(c, o.cosa); });
test('T-226 cajas de ancho variable no se solapan ni salen del contenedor', () => { const base = modeloCon({ objetos: [['Alfa', []], ['Beta', []]], procesos: ['Contener'] }); const id = (n: string) => porNombre(base, n).id, a = id('Alfa'), b = id('Beta'), p = id('Contener'); const o: OpdDescomposicion = congelar({ id: 'opd-100', tipo: 'descomposicion', padre: base.raiz, cosa: p, orden: 0, bandas: [], objetosInternos: [], apariciones: { [p]: { x: 0, y: 0, ancho: 420, alto: 88 }, [a]: { x: 0, y: 1000, ancho: 400, alto: 60 }, [b]: { x: 1000, y: 1000, ancho: 400, alto: 60 } } }); const externos = colocarDescomposicion(base, o); noSolapes(externos, p); const internos = colocarDescomposicion(base, congelar({ ...o, objetosInternos: [a, b] })); const c = internos[p]!; for (const id of [a, b]) {
    const caja = internos[id]!;
    expect(caja.x).toBeGreaterThanOrEqual(c.x + 40);
    expect(caja.x + caja.ancho).toBeLessThanOrEqual(c.x + c.ancho - 40);
} noSolapes(internos, p); expect(o.apariciones[a]?.ancho).toBe(400); });
test('T-226 grupos externos con tamaños variables conservan separación entre filas y columnas', () => { const base = modeloCon({ objetos: [['Entrada', []], ['Salida Alfa', []], ['Salida Beta', []], ['Agente Alfa', []], ['Agente Beta', []], ['Rasgo Alfa', []], ['Rasgo Beta', []]], procesos: ['Contener', 'Externo Alfa', 'Externo Beta'], enlaces: [['consumo', 'Entrada', 'Contener'], ['resultado', 'Salida Alfa', 'Contener'], ['resultado', 'Salida Beta', 'Contener'], ['agente', 'Agente Alfa', 'Contener'], ['agente', 'Agente Beta', 'Contener']] }); const id = (n: string) => porNombre(base, n).id; const apariciones = Object.fromEntries(Object.keys(base.cosas).map(id => [id, { x: 0, y: 0, ancho: 400, alto: 200 }])); const o: OpdDescomposicion = congelar({ id: 'opd-100', tipo: 'descomposicion', padre: base.raiz, cosa: id('Contener'), orden: 0, bandas: [], objetosInternos: [], apariciones }); const c = colocarDescomposicion(base, o); noSolapes(c, o.cosa); for (const n of ['Salida Alfa', 'Salida Beta'])
    expect(c[id(n)]!.x).toBeGreaterThan(c[o.cosa]!.x + c[o.cosa]!.ancho); expect(c[id('Externo Alfa')]!.y).toBeGreaterThan(c[id('Salida Beta')]!.y + c[id('Salida Beta')]!.alto); expect(c[id('Rasgo Alfa')]!.y).toBeGreaterThan(c[o.cosa]!.y + c[o.cosa]!.alto); });

function modeloConBandasAltas(altos: readonly number[], altosInternos: readonly number[] = []): { modelo: Modelo; opd: OpdDescomposicion } {
    const base = modeloCon({
        procesos: ['Contener', ...altos.map((_, i) => `Subproceso_${i}`)],
        objetos: altosInternos.map((_, i) => [`Interno_${i}`, []] as const),
    });
    const contenedor = porNombre(base, 'Contener').id;
    const caja = { x: 0, y: 0, ancho: 135, alto: 60 };
    const bandas = altos.map((_, i) => [porNombre(base, `Subproceso_${i}`).id]);
    const objetosInternos = altosInternos.map((_, i) => porNombre(base, `Interno_${i}`).id);
    const apariciones = Object.fromEntries([
        [contenedor, caja],
        ...altos.map((alto, i) => [bandas[i]![0]!, { x: 180 * i, y: 100, ancho: 135, alto }]),
        ...altosInternos.map((alto, i) => [objetosInternos[i]!, { x: 180 * i, y: 400, ancho: 135, alto }]),
    ]);
    const opd: OpdDescomposicion = congelar({ id: 'opd-100', tipo: 'descomposicion', padre: base.raiz,
        cosa: contenedor, orden: 0, bandas, objetosInternos, apariciones });
    const modelo: Modelo = congelar({ ...base, secuencia: 101, opds: {
        [base.raiz]: { id: base.raiz, tipo: 'raiz', apariciones: { [contenedor]: caja } }, [opd.id]: opd,
    } });
    modeloValidado = modelo;
    return { modelo, opd };
}

test('T-226 una banda con proceso 135×150 válido queda contenida', () => {
    const { modelo, opd } = modeloConBandasAltas([150]);
    expect(validarForma(modelo)).toEqual([]);
    const c = colocarDescomposicion(modelo, opd), contenedor = c[opd.cosa]!, sub = c[opd.bandas[0]![0]!]!;
    expect(sub.ancho).toBe(135);
    expect(sub.alto).toBe(150);
    expect(sub.y + sub.alto).toBeLessThanOrEqual(contenedor.y + contenedor.alto);
});
test('T-226 dos bandas con tamaños válidos no se solapan y quedan contenidas', () => {
    const { modelo, opd } = modeloConBandasAltas([150, 150]);
    expect(validarForma(modelo)).toEqual([]);
    const c = colocarDescomposicion(modelo, opd);
    noSolapes(c, opd.cosa);
    const contenedor = c[opd.cosa]!;
    for (const b of opd.bandas) for (const id of b)
        expect(c[id]!.y + c[id]!.alto).toBeLessThanOrEqual(contenedor.y + contenedor.alto);
});
test('T-226 bandas de altos heterogéneos acumulan sus pasos y conservan cajas guardadas', () => {
    const { modelo, opd } = modeloConBandasAltas([30, 150, 80]);
    const antes = JSON.stringify(modelo), apariciones = opd.apariciones;
    const c = colocarDescomposicion(modelo, opd), contenedor = c[opd.cosa]!;
    expect(opd.bandas.map(b => c[b[0]!]!.y)).toEqual([64, 164, 354]);
    expect(contenedor.alto).toBe(498);
    expect(opd.bandas.map(b => c[b[0]!]!.alto)).toEqual([30, 150, 80]);
    expect(opd.bandas.map(b => c[b[0]!]!.ancho)).toEqual([135, 135, 135]);
    noSolapes(c, opd.cosa);
    expect(colocarDescomposicion(modelo, opd)).toEqual(c);
    expect(opd.apariciones).toBe(apariciones);
    expect(JSON.stringify(modelo)).toBe(antes);
});
test('T-226 fila de internos altos reserva su máximo más margen y queda contenida', () => {
    const { modelo, opd } = modeloConBandasAltas([150], [200, 80]);
    const antes = JSON.stringify(modelo);
    const c = colocarDescomposicion(modelo, opd), contenedor = c[opd.cosa]!;
    expect(contenedor.alto).toBe(518);
    for (const id of opd.objetosInternos) {
        expect(c[id]!.y).toBe(254);
        expect(c[id]!.alto).toBe(opd.apariciones[id]!.alto);
        expect(c[id]!.ancho).toBe(opd.apariciones[id]!.ancho);
        expect(c[id]!.y + c[id]!.alto).toBeLessThanOrEqual(contenedor.y + contenedor.alto - 24);
    }
    noSolapes(c, opd.cosa);
    expect(JSON.stringify(modelo)).toBe(antes);
});
