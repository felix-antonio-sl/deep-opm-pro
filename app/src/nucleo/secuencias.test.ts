import { expect, test } from 'bun:test';
import { azar } from '../pruebas/azar';
import { congelar } from '../pruebas/constructores';
import { aplicarAccion } from './operaciones';
import { validarForma } from './forma';
import { erroresContexto } from './matriz';
import type { Violacion } from './resultado';
const operacionesVistas = new Set<string>();
const estadisticas: Record<string, { seleccionadas: number; aceptadas: number; rechazadas: number; cambios: number }> = {};
const clave = (v: Violacion) => JSON.stringify([v.codigo, v.refs.map(r => `${r.tipo}:${r.id}`).sort()]);
for (let semilla = 0; semilla < 200; semilla++) test(`T-303 DS20 secuencia ${semilla}: 40 acciones sin reintentos y entrada inmutable`, () => {
    let m = azar(semilla, 'completo'), estado = (semilla + 1) >>> 0;
    for (let paso = 0; paso < 40; paso++) {
        estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
        const acciones = azar.acciones(m); expect(acciones.length).toBeGreaterThan(0);
        const accion = acciones[estado % acciones.length]!; operacionesVistas.add(accion.op);
        const antes = JSON.stringify(m), previos = new Set(erroresContexto(m).map(clave)); congelar(m); congelar(accion);
        const r = aplicarAccion(m, accion); expect(JSON.stringify(m)).toBe(antes);
        const cuenta = estadisticas[accion.op] ??= { seleccionadas: 0, aceptadas: 0, rechazadas: 0, cambios: 0 }; cuenta.seleccionadas++;
        if (r.ok) { cuenta.aceptadas++; if (JSON.stringify(r.valor.modelo) !== antes) cuenta.cambios++; } else cuenta.rechazadas++;
        if (r.ok) m = r.valor.modelo;
        expect(validarForma(m), JSON.stringify({ semilla, paso, accion, respuesta: r.ok ? 'ok' : r.rechazo })).toEqual([]);
        expect(erroresContexto(m).filter(v => !previos.has(clave(v)))).toEqual([]);
    }
});
test('T-303 secuencias realmente eligen las ocho operaciones de refinamiento', () => {
    for (const op of ['descomponer', 'agregarSubprocesos', 'moverSubproceso', 'fijarBandas', 'desplegar', 'agregarRefinadores', 'eliminarRefinamiento', 'distribuirEnlace']) expect(operacionesVistas.has(op), op).toBe(true);
});

test('T-303 las ocho operaciones de refinamiento son aceptadas en las 8000 acciones sin filtro', () => {
    expect(Object.values(estadisticas).reduce((n, e) => n + e.seleccionadas, 0)).toBe(8000);
    for (const op of ['descomponer', 'agregarSubprocesos', 'moverSubproceso', 'fijarBandas', 'desplegar', 'agregarRefinadores', 'eliminarRefinamiento', 'distribuirEnlace']) { expect(estadisticas[op]?.aceptadas, op).toBeGreaterThan(0); }
    console.info('WP4r secuencias estadísticas ' + JSON.stringify(estadisticas));
});
