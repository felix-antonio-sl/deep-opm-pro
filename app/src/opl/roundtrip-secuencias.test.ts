import { expect, test } from 'bun:test';
import type { Modelo } from '../nucleo/tipos';
import { aplicarAccion } from '../nucleo/operaciones';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { azar } from '../pruebas/azar';
import { generarBloque, textoCanonico } from './generar';
import { planificar } from './planificar';
import { analizar } from './analizar';

// Modelos alcanzados por 40 operaciones aleatorias (refinamientos de proceso y de objeto incluidos, B-02): cada OPD
// se relee sin acciones ni errores, el documento v0 es punto fijo y la oración de descomposición, analizada desde
// cero (sin la identidad textual del plan), devuelve la cosa, sus miembros en orden y sus internos.
// Las discrepancias se agregan en una sola aserción.
test('T-191 T-064 B-02 secuencias aleatorias: cada OPD se relee sin acciones y el archivo es punto fijo', () => {
    const discrepancias: string[] = [];
    let conObjeto = 0;
    for (let semilla = 0; semilla < 200; semilla++) {
        let m: Modelo = azar(semilla, 'completo'), estado = (semilla + 1) >>> 0;
        for (let paso = 0; paso < 40; paso++) {
            estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
            const acciones = azar.acciones(m), r = aplicarAccion(m, acciones[estado % acciones.length]!);
            if (r.ok) m = r.valor.modelo;
        }
        if (Object.values(m.opds).some(o => o.tipo === 'descomposicion' && m.cosas[o.cosa]?.tipo === 'objeto')) conObjeto++;
        const v0 = exportarV0(m), r = importarV0(v0);
        if (!r.ok || exportarV0(r.modelo) !== v0) discrepancias.push(`${semilla}: códec`);
        for (const opd of Object.keys(m.opds)) {
            const p = planificar(m, opd, textoCanonico(generarBloque(m, opd)));
            const errores = p.lineas.flatMap(l => l.diagnosticos.filter(d => d.severidad === 'error').map(d => d.codigo));
            if (p.acciones.length || errores.length) discrepancias.push(`${semilla}/${opd}: ${p.acciones.map(a => a.op).join(',')} ${errores.join(',')}`);
            const o = m.opds[opd]!, linea = generarBloque(m, opd).find(l => l.plantilla.startsWith('CX'));
            if (o.tipo !== 'descomposicion' || !linea) continue;
            const nombre = (id: string) => m.cosas[id]!.nombre, orden = (xs: readonly string[]) => [...xs].sort();
            const esperado = { cosa: { nombre: nombre(o.cosa), tipo: m.cosas[o.cosa]!.tipo }, bandas: o.bandas.map(b => orden(b.map(nombre))), internos: orden(o.internos.map(nombre)) };
            const leido = analizar(linea.texto)[0]!.hechos.find(h => h.k === 'descomposicion');
            const obtenido = leido?.k === 'descomposicion' ? { cosa: leido.cosa, bandas: leido.bandas.map(orden), internos: orden(leido.internos) } : null;
            if (JSON.stringify(obtenido) !== JSON.stringify(esperado)) discrepancias.push(`${semilla}/${opd}: ${linea.texto}`);
        }
    }
    expect(discrepancias).toEqual([]);
    expect(conObjeto).toBeGreaterThan(100);
});
